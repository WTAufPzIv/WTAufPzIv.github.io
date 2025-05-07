# 前言

之前公司的的低代码项目使用了lerna作为monorepo的实现方案，但是当时项目内使用的是npm+webpack作为工具，时间比较久远。

考虑到pnpm在速度上的优势，以及目前vite作为很主流的构建工具，因此从0开始尝试搭建了一个测试脚手架，同样以低代码平台作为业务目的，采用lerna + vite + pnpm

# 项目目录

```text
my-project
├─ packages
│  ├─ mao-core                     # 项目共用核心SDK
│  ├─ mao-editor                   # 编辑器
│  ├─ mao-render                   # 渲染器
│  ├─ mao-www                      # 门户页面 & 管理后台
│  └─ mao-elements                 # 组件
```
# 初始化

## 安装lerna和构建目录

先全局安装lerna

```bash
npm install -g lerna
```

初始化的过程就不多做描述，官网有相关的介绍，运行```lerna init```后按说明填写信息就可以初始化

然后就是给仓库中添加包，使用的是lerna create命令，其签名为：

```lerna create <name> [loc(指定目录)]```

当然也可以不使用lerna create，自己在packages下面创建目录，然后运行```npm init```，稍微更自由一些。

## 搭配pnpm

先全局安装pnpm

```bash
npm install -g pnpm
```

删除根目录中的 node_modules/ 文件夹（如果存在）。如果尚未使用工作区，请运行 lerna clean 以删除所有包中的 node_modules/ 文件夹。

配置根目录中的```lerna.json```

```json
{
  "version": "0.0.0",
  "npmClient": "pnpm"
}

```

在项目的根目录中创建一个```pnpm-workspace.yaml```文件，内容如下：

```yaml
packages:
  - "packages/*"
```

如果是老项目，packages.json中有workspaces，请将其删除。

```json
{
  "workspaces": ["packages/*"]
}
```

如果是之前就使用了lerna的老项目，而且在```lerna.json```中有packages配置，也将其删除

```json
{
  "packages": ["packages/*"]
}
```

# 构建【生产-消费】链路

这里以mao-www为例，mao-www是消费端，mao-core是生产端。

我们的例子就以www页面成功调用coer中的方法为目标，且不管是www的代码还是core的代码发生更改都能触发页面更新

## 构建mao-www

对于消费者页面，构建过程非常简单，需要特殊处理的地方不多，可以使用vue的任意脚手架构建。

然后在packages.json中以依赖包的形式引入mao-core，引入方式为workspace

```json
{
  "dependencies": {
    "@mao/core": "workspace:^1.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit --skipLibCheck && vite build",
  }
}
```

同时还要注意script命令需要统一，这里使用的是dev

到此消费端就已经构建完成，没错，不需要再做其他任何事情

## 构建mao-core

生产者端构建过程相对复杂

通常来说如果我的mao-core下有如下的目录结构：

```text
mao-core
├─ src
│ ├─common
│   ├─ utils                     
│     ├─ request.ts                    
```

为了在消费端能够以下面的方式引入：

```ts
import { http } from "@mao/core/common/utils/request";
```

即在引入的时候保留完整的源SDK路径。

这样做的好处是，在core端不需要做统一的收口导出，为了实现这个需求，core包需要做如下处理

1. 还是按照常规，先搭建好目录
```text
mao-core
├─ src
│  ├─ common
│      ├─ utils                     
│         ├─ request.ts     
├─ packages.json
├─ vite.config.ts
├─ tsconfig.json
├─ index.ts     
```

2、index.ts
这个文件没有实际上的作用，也不要往这里面添加方法，这个文件存在的唯一目的是为了在vite中做lib的入口映射

3、vite.config.json

这个文件的配置如下，一些配置的说明可见于注释

```ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';
import glob from 'fast-glob';
import * as path from 'path';

const entries = glob.sync(['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts']);
const input = Object.fromEntries(
    entries.map(entry => [
        entry.replace(/^src\//, '').replace(/\.ts$/, ''),
        path.resolve(entry)
    ])
);

export default defineConfig({
    // 生成声明文件
    plugins: [
        dts({ outDir: 'dist/types', entryRoot: 'src' })
    ],
    build: {
        // lib参数让vite将这个包视为一个纯工具库，纯工具库没有index.html作为入口
        lib: {
            // index.ts文件作为入口，但实际用不到这个文件
            entry: resolve(__dirname, "./index.ts"),
            // 输出的包名，可以随便取
            name: "@mao/core",
            fileName: "[name]",
            // 编译输出的格式，这里只用到了es、umd、cjs
            formats: ["es", "umd", "cjs"],
        },
        outDir: 'dist',
        sourcemap: true,
        minify: true,
        rollupOptions: {
            // 通过fast-glob动态生成的src下的模块入口
            input,
            output: {
                // 核心配置：打包出来的产物保留原有目录结构
                preserveModules: true,
                // 必须和上一个搭配使用，要保留的目录节点
                preserveModulesRoot: 'src',
                entryFileNames: '[format]/[name].js',
                // 不加这个会报错
                inlineDynamicImports: false
            },
            // 纯工具库不可能单独运行，可以将一些主库里一定会有的东西排除出去，这里就看自己的需求了
            external: ["vue", "axios", "sass", "pinia"]
        }
    }
});

```

核心的思路就是使用fast-glob遍历src下所有文件夹的入口文件，然后动态添加到input中，这样在构建的时候配合preserveModules和preserveModulesRoot参数，就会让生成的产物保留原有的目录结构

通过上面的配置，在打包后就会生成这样的dist目录

```text
dist
├─ cjs
│  ├─ common
│      ├─ utils  
│         ├─ request.ts  
├─ es
│  ├─ common
│      ├─ utils    
│         ├─ request.ts     
├─ type
│  ├─ common
│      ├─ utils   
│         ├─ request.ts   
```

可以看到，打包产物已经符合了我们的预期

4. packages.json

然后就需要配置packages.json:
- exports参数，配置消费者在导入模块时的路径映射
- 配置files
- 配置scripts，实现lerna识别dev命令并运行后以watch执行build，实现动态更改打包

```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./es/index.js",
      "require": "./cjs/index.js"
    },
    "./*": {
      "types": "./dist/types/**/*.d.ts",
      "import": "./dist/es/*",
      "require": "./dist/cjs/*"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  }
}

```

5. tsconfig.json

这个文件没什么特殊的配置，正常来就好，下面是一个例子

```json
  "extends": "../../tsconfig",
  "compilerOptions": {
    "module": "ESNext",     
    "target": "ESNext",
    "declaration": true,
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

# 根目录命令

至此就配置完成，这个时候在根目录配置script

```json
{
  "scripts": {
    "bootstrap": "lerna run dev --parallel"
  }
}
```

--parallel参数是为了让lerna并行运行，防止在运行core的```vite build -watch```时占用卡主进程，无法进行下一步命令

首次运行需要在项目根目录运行

```bash
pnpm install
```

将core包以软连接的方式引入到www包的node_modules中

最后运行

```bash
pnpm run bootstrap
```

项目会依次并行启动，大功告成！
