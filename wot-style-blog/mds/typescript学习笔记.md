---
date: 2020-06-27
categories: [技术,前端,typescript]
thumbnail: /images/fe/ts.jpg
toc: true
---

# 前言
TypeScript 是 JavaScript 的类型的超集，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。
<!--more-->

## typescript的优势
1. TypeScript 增加了代码的可读性和可维护性
- 类型系统实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用了
- 可以在编译阶段就发现大部分错误，这总比在运行时候出错好
- 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等

2. TypeScript 非常包容
- TypeScript 是 JavaScript 的超集，.js 文件可以直接重命名为 .ts 即可
- 即使不显式的定义类型，也能够自动做出类型推论
- 可以定义从简单到复杂的几乎一切类型
- 即使 TypeScript 编译报错，也可以生成 JavaScript 文件
- 兼容第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供TypeScript 读取

3. TypeScript 拥有活跃的社区
- 大部分第三方库都有提供给 TypeScript 的类型定义文件
- Google 开发的 Angular2 就是使用 TypeScript 编写的
- TypeScript 拥抱了 ES6 规范，也支持部分 ESNext 草案的规范

## 安装
TypeScript 的命令行工具安装方法如下：

```javascript
npm install -g typescript
```

以上命令会在全局环境下安装 tsc 命令，安装完成之后，我们就可以在任何地方执行 tsc 命令了。

编译一个 TypeScript 文件很简单：

```javascript
tsc hello.ts
```

我们约定使用 TypeScript 编写的文件以 .ts 为后缀，用 TypeScript 编写 React 时，以 .tsx 为后缀。

## 第一行ts代码
复制以下代码到一个新建的ts文件当中：

```javascript
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```

然后执行

```javascript
tsc hello.ts
```

这时候会生成一个编译好的文件 hello.js：

```javascript
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```

TypeScript 中，使用```: ```指定变量的类型，```: ```的前后有没有空格都可以。

上述例子中，我们用 ```: ```指定 person 参数类型为 string。但是编译为 js 之后，并没有什么检查的代码被插入进来。

TypeScript 只会进行静态检查，如果发现有错误，编译的时候就会报错。

let 是 ES6 中的关键字，和 var 类似，用于定义一个局部变量，可以参阅 let 和 const 命令。

下面尝试把这段代码编译一下：

```javascript
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = [0, 1, 2];
console.log(sayHello(user));
```

编辑器中会提示错误，编译的时候也会出错：

> index.ts(6,22): error TS2345: Argument of type 'number[]' is not assignable to parameter of  type 'string'.

但是还是生成了 js 文件：

```javascript
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = [0, 1, 2];
console.log(sayHello(user));
```

TypeScript 编译的时候即使报错了，还是会生成编译结果，我们仍然可以使用这个编译之后的文件。

如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 noEmitOnError 即可。关于 tsconfig.json，请参阅[官方手册（中文版）](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)。

# 语法
## 基础
为了让程序有价值，我们需要能够处理最简单的数据单元：数字，字符串，结构体，布尔值等。 TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

### 布尔类型

```javascript
let isDone: boolean = false;
```

### 数值类型
和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。

```javascript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

### 字符串
 像其它语言里一样，我们使用string表示文本数据类型。 和JavaScript一样，可以使用双引号（"）或单引号（'）表示字符串。

```javascript
let name: string = "bob";
name = "smith";
```

你还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号
```
(`)
```
包围，并且以${ expr }这种形式嵌入表达式

```javascript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.I'll be ${ age + 1 } years old next month.`;
```

这与下面定义sentence的方式效果相同：

```javascript
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

### 数组
TypeScript像JavaScript一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：

```javascript
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，Array<元素类型>：

```javascript
let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为string和number类型的元组。

```javascript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

当访问一个已知索引的元素，会得到正确的类型：

```javascript
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

当访问一个越界的元素，会使用**联合类型**替代：

```javascript
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
x[6] = true; // Error, 布尔不是(string | number)类型
```

联合类型是高级主题，我们会在以后的章节里讨论它。

### 枚举
enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```javascript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```
上述代码编译为JS之后是这样的：

```javascript
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
```

我们打印一下Color：

```javascript
{ '0': 'Red', '1': 'Green', '2': 'Blue', Red: 0, Green: 1, Blue: 2 }
```

默认情况下，从0开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从1开始编号：

```javascript
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```javascript
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：

```javascript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];
console.log(colorName); 
```

### 任意值
有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用any类型来标记这些变量：

```javascript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

在对现有代码进行改写的时候，any类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为Object有相似的作用，就像它在其它语言中那样。 但是Object类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：

```javascript
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

当你只知道一部分数据的类型时，any类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：

```javascript
let list: any[] = [1, true, "free"];

list[1] = 100;
```

### 空值
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是void：

```javascript
function warnUser(): void {
    console.log("This is my warning message");
}
```

声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：

```javascript
let unusable: void = undefined
```

### 对象的类型——接口
在 TypeScript 中，我们使用接口**（Interfaces）**来定义对象的类型。

什么是接口：
在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。

简单的例子：

```javascript
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

上面的例子中，我们定义了一个接口 Person，接着定义了一个变量 tom，它的类型是 Person。这样，我们就约束了 tom 的形状必须和接口 Person 一致。

接口一般首字母大写。有的编程语言中会建议接口的名称加上```I ```前缀。

定义的变量比接口少了一些属性是不允许的：

```javascript
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom'
};

// index.ts(6,5): error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
//   Property 'age' is missing in type '{ name: string; }'.
```

多一些属性也是不允许的：

```javascript
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

可见，赋值的时候，变量的形状必须和接口的形状保持一致。

可选属性：
有时我们希望不要完全匹配一个形状，那么可以用可选属性：

```javascript
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

可选属性的含义是该属性可以不存在。

这时仍然不允许添加未定义的属性：

```javascript
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// examples/playground/index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

任意属性：
有时候我们希望一个接口允许有任意的属性，可以使用如下方式：

```javascript
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```

使用 [propName: string] 定义了任意属性取 string 类型的值。

需要注意的是，**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**：

```javascript
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};

// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

上例中，任意属性的值允许是 string，**但是可选属性 age 的值却是 number，number 不是 string 的子属性，所以报错了**。

另外，在报错信息中可以看出，此时 { name: 'Tom', age: 25, gender: 'male' } 的类型被推断成了 { [x: string]: string | number; name: string; age: number; gender: string; }，这是联合类型和接口的结合。

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型：

```javascript
interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
```

只读属性：
有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 readonly 定义只读属性：

```javascript
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527;

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

上例中，使用 readonly 定义的属性 id 初始化后，又被赋值了，所以报错了。

注意，只读的约束存在于**第一次给对象赋值**的时候，而不是第一次给只读属性赋值的时候，只读属性不能是可选属性，初始化的时候必须带有该属性

```javascript
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757;

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

上例中，报错信息有两处，第一处是在对 tom 进行赋值的时候，没有给 id 赋值。

第二处是在给 tom.id 赋值的时候，由于它是只读属性，所以报错了。


### 函数

> 一句闲话：函数是JS中的一等公民

**函数声明：**
众所周知，在 JavaScript 中，有两种常见的定义函数的方式——**函数声明（Function Declaration）和函数表达式（Function Expression）**：

```javascript
// 函数声明（Function Declaration）
function sum(x, y) {
    return x + y;
}

// 函数表达式（Function Expression）
let mySum = function (x, y) {
    return x + y;
};
```

一个函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到，其中函数声明的类型定义较简单：

```javascript
function sum(x: number, y: number): number {
    return x + y;
}
```

注意，**输入多余的（或者少于要求的）参数，是不被允许的：**

```javascript
function sum(x: number, y: number): number {
    return x + y;
}
sum(1, 2, 3);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
function sum(x: number, y: number): number {
    return x + y;
}
sum(1);

// index.ts(4,1): error TS2346: Supplied parameters do not match any signature of call target.
```

**函数表达式：**
如果要我们现在写一个对函数表达式（Function Expression）的定义，可能会写成这样：

```javascript
let mySum = function (x: number, y: number): number {
    return x + y;
};
```

这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 mySum，是通过赋值操作进行**类型推论**而推断出来的。如果需要我们手动给 mySum 添加类型，则应该是这样：

```javascript
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

**注意不要混淆了 TypeScript 中的 ```=>```和 ES6 中的 ```=>```。**

在 TypeScript 的类型定义中，```=>```用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

在 ES6 中，```=> ```叫做箭头函数，应用十分广泛，可以参考 ES6 中的箭头函数。

**用接口定义函数的形状：**
我们也可以使用接口的方式来定义一个函数需要符合的形状：

```javascript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

**可选参数：**
前面提到，输入多余的（或者少于要求的）参数，是不允许的。那么如何定义可选的参数呢？

与接口中的可选属性类似，我们用 ? 表示可选的参数：

```javascript
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

需要注意的是，**可选参数必须接在必需参数后面。换句话说，可选参数后面不允许再出现必需参数了**：

```javascript
function buildName(firstName?: string, lastName: string) {
    if (firstName) {
        return firstName + ' ' + lastName;
    } else {
        return lastName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName(undefined, 'Tom');

// index.ts(1,40): error TS1016: A required parameter cannot follow an optional parameter.
```

**参数默认值：**
在 ES6 中，我们允许给函数的参数添加默认值，TypeScript 会将添加了默认值的参数识别为可选参数：

```javascript
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

此时就不受「可选参数必须接在必需参数后面」的限制了：

```javascript
function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Cat');
```

关于默认参数，可以参考 ES6 中函数参数的默认值。

**剩余参数：**
ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数（rest 参数）：

```javascript
function push(array, ...items) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a: any[] = [];
push(a, 1, 2, 3);
```

事实上，items 是一个数组。所以我们可以用数组的类型来定义它：

```javascript
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

注意，rest 参数只能是最后一个参数，关于 rest 参数，可以参考 ES6 中的 rest 参数。

**重载：**
重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 reverse，输入数字 123 的时候，输出反转的数字 321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。

利用联合类型，我们可以这么实现：

```javascript
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。

这时，我们可以使用重载定义多个 reverse 的函数类型：

```javascript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。
### 类型推断
以下代码虽然没有指定类型，但是会在编译的时候报错：

```javascript
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

事实上，它等价于：

```javascript
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：

```javascript
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```


### 类型断言
有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。
通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。
类型断言有两种形式。 其一是“尖括号”语法：

```javascript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

另一个为as语法：

```javascript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

两种形式是等价的。 至于使用哪个大多数情况下是凭个人喜好；然而，当你在TypeScript里使用JSX时，只有as语法断言是被允许的。

### 联合类型
联合类型（Union Types）表示取值可以为多种类型中的一种。

简单的例子：

```javascript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
let myFavoriteNumber: string | number;
myFavoriteNumber = true;

// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

联合类型使用```| ```分隔每个类型。

这里的 ```let myFavoriteNumber: string | number ```的含义是，允许 myFavoriteNumber 的类型是 string 或者 number，但是不能是其他类型。

访问联合类型的属性或方法§
当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```javascript
function getLength(something: string | number): number {
    return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

上例中，**length 不是 string 和 number 的共有属性**，所以会报错。

访问 string 和 number 的共有属性是没问题的：

```javascript
function getString(something: string | number): string {
    return something.toString();
}
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```javascript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

上例中，第二行的 myFavoriteNumber 被推断成了 string，访问它的 length 属性不会报错。

而第四行的 myFavoriteNumber 被推断成了 number，访问它的 length 属性时就报错了。

### Null 和 Undefined
TypeScript里，undefined和null两者各自有自己的类型分别叫做undefined和null。 和void相似，它们的本身的类型用处不是很大：

```javascript
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

默认情况下null和undefined是所有类型的子类型。 就是说**你可以把null和undefined赋值给number类型的变量**。
然而，当你指定了**--strictNullChecks**标记，**null和undefined只能赋值给void和它们各自**。 这能避免很多常见的问题。 也许在某处你想传入一个string或null或undefined，你可以使用联合类型string | null | undefined。

注意：我们鼓励尽可能地使用--strictNullChecks


### Never
never类型表示的是那些永不存在的值的类型。 例如，never类型是那些**总是会抛出异常**或**根本就不会有返回值**的函数表达式或箭头函数表达式的返回值类型； 变量也可能是never类型，当它们被永不为真的类型保护所约束时。

**never类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是never的子类型或可以赋值给never类型（除了never本身之外）。 即使any也不可以赋值给never**。
下面是一些返回never类型的函数：

```javascript

function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

## 声明文件
当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型
- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块
- export as namespace UMD 库声明全局变量
- declare global 扩展全局变量
- declare module 扩展模块
- ```/// <reference /> 三斜线指令```

### 什么是声明语句
假如我们想使用第三方库 jQuery，一种常见的方式是在 html 中通过```<script> ```标签引入 jQuery，然后就可以使用全局变量```$ ```或 jQuery 了。

我们通常这样获取一个 id 是 foo 的元素：

```javascript
$('#foo');
// or
jQuery('#foo');
```

但是在 ts 中，编译器并不知道 ```$ ```或 jQuery 是什么东西1：

```javascript
jQuery('#foo');
// ERROR: Cannot find name 'jQuery'.
```

这时，我们需要使用 declare var 来定义它的类型2：

```javascript
declare var jQuery: (selector: string) => any;

jQuery('#foo');
```

上例中，declare var 并没有真的定义一个变量，只是定义了全局变量 jQuery 的类型，仅仅会用于编译时的检查，在编译结果中会被删除。它编译结果是：

```javascript
jQuery('#foo');
```

除了 declare var 之外，还有其他很多种声明语句，将会在后面详细介绍。


### 什么是声明文件
通常我们会把声明语句放到一个单独的文件**（jQuery.d.ts）**中，这就是声明文件3：

```javascript
// src/jQuery.d.ts

declare var jQuery: (selector: string) => any;
// src/index.ts

jQuery('#foo');
```
**声明文件必需以 .d.ts 为后缀。**

一般来说，ts 会解析项目中所有的```*.ts ```文件，当然也包含以```.d.ts ```结尾的文件。所以当我们将```jQuery.d.ts```放到项目中时，其他所有 ```*.ts ```文件就都可以获得 jQuery 的类型定义了。

![](/images/assets/20200624111613933.png)
假如仍然无法解析，那么可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件。

这里只演示了全局变量这种模式的声明文件，假如是通过模块导入的方式使用第三方库的话，那么引入声明文件又是另一种方式了，将会在后面详细介绍。

### 书写声明文件
当一个第三方库没有提供声明文件时，我们就需要自己书写声明文件了。前面只介绍了最简单的声明文件内容，而真正书写一个声明文件并不是一件简单的事，以下会详细介绍如何书写声明文件。

在不同的场景下，声明文件的内容和使用方式会有所区别。

库的使用场景主要有以下几种：

- 全局变量：通过```<script> ```标签引入第三方库，注入全局变量
- npm 包：通过```import foo from 'foo' ```导入，符合 ES6 模块规范
- UMD 库：既可以通过```<script>```标签引入，又可以通过```import ```导入
- 直接扩展全局变量：通过```<script> ```标签引入后，改变一个全局变量的结构
- 在 npm 包或 UMD 库中扩展全局变量：引用 npm 包或 UMD 库后，改变一个全局变量的结构
- 模块插件：通过```<script>```或 ```import ```导入后，改变另一个模块的结构

#### 全局变量
全局变量是最简单的一种场景，之前举的例子就是通过```<script> ```标签引入 jQuery，注入全局变量 ```$ ```和 ```jQuery```。

使用全局变量的声明文件时，如果是以 ```npm install @types/xxx --save-dev ```安装的，则不需要任何配置。如果是将声明文件直接存放于当前项目中，则建议和其他源码一起放到 src 目录下（或者对应的源码目录下）：

![](/images/assets/20200624112459996.png)
如果没有生效，可以检查下 tsconfig.json 中的 files、include 和 exclude 配置，确保其包含了 jQuery.d.ts 文件。

全局变量的声明文件主要有以下几种语法：

- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型

##### declare var/let/const
在所有的声明语句中，declare var 是最简单的，如之前所学，它能够用来定义一个全局变量的类型。与其类似的，还有 declare let 和 declare const，使用 let 与使用 var 没有什么区别：

```javascript
// src/jQuery.d.ts
declare let jQuery: (selector: string) => any;

// src/index.ts
jQuery('#foo');
// 使用 declare let 定义的 jQuery 类型，允许修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
};
```

而当我们使用 const 定义时，表示此时的全局变量是一个常量，不允许再去修改它的值了4：

```javascript
// src/jQuery.d.ts
declare const jQuery: (selector: string) => any;
jQuery('#foo');
// 使用 declare const 定义的 jQuery 类型，禁止修改这个全局变量
jQuery = function(selector) {
    return document.querySelector(selector);
};
// ERROR: Cannot assign to 'jQuery' because it is a constant or a read-only property.
```

一般来说，全局变量都是禁止修改的常量，所以大部分情况都应该使用 const 而不是 var 或 let。

需要注意的是，声明语句中只能定义类型，**切勿在声明语句中定义具体的实现**：

```javascript
declare const jQuery = function(selector) {
    return document.querySelector(selector);
};
// ERROR: An implementation cannot be declared in ambient contexts.
```

##### declare function
declare function 用来定义全局函数的类型。jQuery 其实就是一个函数，所以也可以用 function 来定义：

```javascript
// src/jQuery.d.ts
declare function jQuery(selector: string): any;

// src/index.ts
jQuery('#foo');
```

在函数类型的声明语句中，函数重载也是支持的：

```javascript
// src/jQuery.d.ts
declare function jQuery(selector: string): any;
declare function jQuery(domReadyCallback: () => any): any;

// src/index.ts
jQuery('#foo');
jQuery(function() {
    alert('Dom Ready!');
});
```

##### declare class
当全局变量是一个类的时候，我们用 declare class 来定义它的类型：

```javascript
// src/Animal.d.ts
declare class Animal {
    name: string;
    constructor(name: string);
    sayHi(): string;
}

// src/index.ts
let cat = new Animal('Tom');
```

同样的，declare class 语句也**只能用来定义类型，不能用来定义具体的实现**，比如定义 sayHi 方法的具体实现则会报错：

```javascript
// src/Animal.d.ts
declare class Animal {
    name: string;
    constructor(name: string);
    sayHi() {
        return `My name is ${this.name}`;
    };
    // ERROR: An implementation cannot be declared in ambient contexts.
}
```

##### declare enum
使用 declare enum 定义的枚举类型也称作外部枚举（Ambient Enums），举例如下：

```javascript
// src/Directions.d.ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

// src/index.ts
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

与其他全局变量的类型声明一致，declare enum 仅用来定义类型，而不是具体的值。

Directions.d.ts 仅仅会用于编译时的检查，**声明文件里的内容在编译结果中会被删除**。它编译结果是：

```var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];```

其中 Directions 是由第三方库定义好的全局变量。

##### declare namespace
namespace 是 ts 早期时为了解决模块化而创造的关键字，中文称为命名空间。

由于历史遗留原因，在早期还没有 ES6 的时候，ts 提供了一种模块化方案，使用 module 关键字表示内部模块。但由于后来 ES6 也使用了 module 关键字，ts 为了兼容 ES6，使用 namespace 替代了自己的 module，更名为命名空间。

随着 ES6 的广泛应用，**现在已经不建议再使用 ts 中的 namespace**，而**推荐使用 ES6 的模块化方案**了，故我们不再需要学习 namespace 的使用了。

namespace 被淘汰了，但是在声明文件中，declare namespace 还是比较常用的，它用来表示全局变量是一个对象，包含很多子属性。

比如 jQuery 是一个全局变量，它是一个对象，提供了一个 jQuery.ajax 方法可以调用，那么我们就应该使用 declare namespace jQuery 来声明这个拥有多个子属性的全局变量。

```javascript
// src/jQuery.d.ts
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}

// src/index.ts
jQuery.ajax('/api/get_something');
```

注意，在 declare namespace 内部，我们直接使用 function ajax 来声明函数，而不是使用 declare function ajax。类似的，也可以使用 const, class, enum 等语句：

```javascript
// src/jQuery.d.ts
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    const version: number;
    class Event {
        blur(eventType: EventType): void
    }
    enum EventType {
        CustomClick
    }
}

// src/index.ts
jQuery.ajax('/api/get_something');
console.log(jQuery.version);
const e = new jQuery.Event();
e.blur(jQuery.EventType.CustomClick);
```

嵌套的命名空间：

如果对象拥有深层的层级，则需要用嵌套的 namespace 来声明深层的属性的类型：

```javascript
// src/jQuery.d.ts
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
    namespace fn {
        function extend(object: any): void;
    }
}

// src/index.ts
jQuery.ajax('/api/get_something');
jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        });
    }
});
```

假如 jQuery 下仅有 fn 这一个属性（没有 ajax 等其他属性或方法），则可以不需要嵌套 namespace11：

```javascript
// src/jQuery.d.ts
declare namespace jQuery.fn {
    function extend(object: any): void;
}

// src/index.ts
jQuery.fn.extend({
    check: function() {
        return this.each(function() {
            this.checked = true;
        });
    }
});
```

##### interface 和 type
除了全局变量之外，可能有一些类型我们也希望能暴露出来。在类型声明文件中，我们可以直接使用 interface 或 type 来声明一个全局的接口或类型：

```javascript
// src/jQuery.d.ts
interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
}
declare namespace jQuery {
    function ajax(url: string, settings?: AjaxSettings): void;
}
//这样的话，在其他文件中也可以使用这个接口或类型了：


// src/index.ts
let settings: AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```

type 与 interface 类似，不再赘述。

##### 防止命名冲突

暴露在最外层的 interface 或 type 会作为全局类型作用于整个项目中，**我们应该尽可能的减少全局变量或全局类型的数量。故最好将他们放到 namespace 下**：

```
// src/jQuery.d.ts

declare namespace jQuery {
    interface AjaxSettings {
        method?: 'GET' | 'POST'
        data?: any;
    }
    function ajax(url: string, settings?: AjaxSettings): void;
}
注意，在使用这个 interface 的时候，也应该加上 jQuery 前缀：

// src/index.ts

let settings: jQuery.AjaxSettings = {
    method: 'POST',
    data: {
        name: 'foo'
    }
};
jQuery.ajax('/api/post_something', settings);
```


##### 声明合并
假如 jQuery 既是一个函数，可以直接被调用 jQuery('#foo')，又是一个对象，拥有子属性 jQuery.ajax()（事实确实如此），那么我们可以组合多个声明语句，它们会不冲突的合并起来：

```javascript
// src/jQuery.d.ts
declare function jQuery(selector: string): any;
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}

// src/index.ts
jQuery('#foo');
jQuery.ajax('/api/get_something');
```

#### npm包
一般我们通过 import foo from 'foo' 导入一个 npm 包，这是符合 ES6 模块规范的。

在我们尝试给一个 npm 包创建声明文件之前，需要先看看它的声明文件是否已经存在。一般来说，npm 包的声明文件可能存在于两个地方：

与该 npm 包绑定在一起。**判断依据是 package.json 中有 types 字段**，或者有一个 index.d.ts 声明文件。这种模式不需要额外安装其他包，是最为推荐的，所以以后我们自己创建 npm 包的时候，最好也将声明文件与 npm 包绑定在一起。
发布到 ```@types```里。我们只需要尝试安装一下对应的```@types ```包就知道是否存在该声明文件，安装命令是```npm install @types/foo --save-dev```。这种模式一般是由于 npm 包的维护者没有提供声明文件，所以只能由其他人将声明文件发布到 @types 里了。
假如以上两种方式都没有找到对应的声明文件，那么我们就需要自己为它写声明文件了。由于是通过 import 语句导入的模块，所以声明文件存放的位置也有所约束，一般有两种方案：

创建一个 ```node_modules/@types/foo/index.d.ts```文件，存放 foo 模块的声明文件。这种方式不需要额外的配置，但是 node_modules 目录不稳定，代码也没有被保存到仓库中，无法回溯版本，有不小心被删除的风险，故不太建议用这种方案，一般只用作临时测试。
创建一个 types 目录，专门用来管理自己写的声明文件，将 foo 的声明文件放到 ```types/foo/index.d.ts ```中。这种方式需要配置下 tsconfig.json 中的 paths 和 baseUrl 字段。
目录结构：

![](/images/assets/20200624141712240.png)
tsconfig.json 内容：

```javascript
{
    "compilerOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
```

如此配置之后，通过 import 导入 foo 的时候，也会去 types 目录下寻找对应的模块的声明文件了。

注意 module 配置可以有很多种选项，不同的选项会影响模块的导入导出模式。这里我们使用了 commonjs 这个最常用的选项，后面的教程也都默认使用的这个选项。

不管采用了以上两种方式中的哪一种，我都强烈建议大家将书写好的声明文件（通过给第三方库发 pull request，或者直接提交到 @types 里）发布到开源社区中，享受了这么多社区的优秀的资源，就应该在力所能及的时候给出一些回馈。只有所有人都参与进来，才能让 ts 社区更加繁荣。

npm 包的声明文件主要有以下几种语法：

- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块

##### export
npm 包的声明文件与全局变量的声明文件有很大区别。在 npm 包的声明文件中，使用 declare 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。只有在声明文件中使用 export 导出，然后在使用方 import 导入后，才会应用到这些类型声明。

export 的语法与普通的 ts 中的语法类似，区别仅在于**声明文件中禁止定义具体的实现**：

```javascript
// types/foo/index.d.ts
export const name: string;
export function getName(): string;
export class Animal {
    constructor(name: string);
    sayHi(): string;
}
export enum Directions {
    Up,
    Down,
    Left,
    Right
}
export interface Options {
    data: any;
}
//对应的导入和使用模块应该是这样：

// src/index.ts
import { name, getName, Animal, Directions, Options } from 'foo';

console.log(name);
let myName = getName();
let cat = new Animal('Tom');
let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
let options: Options = {
    data: {
        name: 'foo'
    }
};
```

##### 混用 declare 和 export
我们也可以使用 declare 先声明多个变量，最后再用 export 一次性导出。上例的声明文件可以等价的改写为16：

```javascript
// types/foo/index.d.ts
declare const name: string;
declare function getName(): string;
declare class Animal {
    constructor(name: string);
    sayHi(): string;
}
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
interface Options {
    data: any;
}
export { name, getName, Animal, Directions, Options };
//注意，与全局变量的声明文件类似，interface 前是不需要 declare 的。
```

##### export namespace
与 declare namespace 类似，export namespace 用来导出一个拥有子属性的对象：

```javascript
// types/foo/index.d.ts
export namespace foo {
    const name: string;
    namespace bar {
        function baz(): string;
    }
}

// src/index.ts
import { foo } from 'foo';
console.log(foo.name);
foo.bar.baz();
```


##### export default
在 ES6 模块系统中，使用 export default 可以导出一个默认值，使用方可以用 import foo from 'foo' 而不是 import { foo } from 'foo' 来导入这个默认值。

在类型声明文件中，export default 用来导出默认值的类型18：

```javascript
// types/foo/index.d.ts
export default function foo(): string;

// src/index.ts
import foo from 'foo';
foo();
```

注意，**只有 function、class 和 interface 可以直接默认导出，其他的变量需要先定义出来，再默认导出**

```javascript
// types/foo/index.d.ts
export default enum Directions {
// ERROR: Expression expected.
    Up,
    Down,
    Left,
    Right
}
```

上例中 export default enum 是错误的语法，需要使用 declare enum 定义出来，然后使用 export default 导出：

```javascript
// types/foo/index.d.ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
export default Directions;
```

针对这种默认导出，我们一般会将导出语句放在整个声明文件的最前面：

```javascript
// types/foo/index.d.ts
export default Directions;
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
```

##### export =
在 commonjs 规范中，我们用以下方式来导出一个模块：

```javascript
// 整体导出
module.exports = foo;
// 单个导出
exports.bar = bar;
```

在 ts 中，针对这种模块导出，有多种方式可以导入，第一种方式是 const ... = require：

```javascript
// 整体导入
const foo = require('foo');
// 单个导入
const bar = require('foo').bar;
```

第二种方式是 import ... from，注意针对整体导出，需要使用 import * as 来导入：

```javascript
// 整体导入
import * as foo from 'foo';
// 单个导入
import { bar } from 'foo
```

第三种方式是 import ... require，这也是 ts 官方推荐的方式：

```javascript
// 整体导入
import foo = require('foo');
// 单个导入
import bar = foo.bar;
```

对于这种使用 commonjs 规范的库，假如要为它写类型声明文件的话，就需要使用到 export = 这种语法了：

```javascript
// types/foo/index.d.ts
export = foo;
declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

需要注意的是，上例中使用了 export = 之后，就不能再单个导出 export { bar } 了。所以我们通过声明合并，使用 declare namespace foo 来将 bar 合并到 foo 里。

准确地讲，export = 不仅可以用在声明文件中，也可以用在普通的 ts 文件中。实际上，import ... require 和 export = 都是 ts 为了兼容 AMD 规范和 commonjs 规范而创立的新语法，由于并不常用也不推荐使用，所以这里就不详细介绍了，感兴趣的可以看官方文档。

由于很多第三方库是 commonjs 规范的，所以声明文件也就不得不用到 export = 这种语法了。但是还是需要再强调下，相比与 export =，**我们更推荐使用 ES6 标准的 export default 和 export**。


#### UMD库
既可以通过```<script> ```标签引入，又可以通过 import 导入的库，称为 UMD 库。相比于 npm 包的类型声明文件，我们需要额外声明一个全局变量，为了实现这种方式，ts 提供了一个新语法 export as namespace。

##### export as namespace
一般使用 export as namespace 时，都是先有了 npm 包的声明文件，再基于它添加一条 export as namespace 语句，即可将声明好的一个变量声明为全局变量，举例如下22：

```javascript
// types/foo/index.d.ts
export as namespace foo;
export = foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

当然它也可以与 export default 一起使用：

```javascript
// types/foo/index.d.ts

export as namespace foo;
export default foo;

declare function foo(): string;
declare namespace foo {
    const bar: number;
}
```

#### 直接扩展全局变量
有的第三方库扩展了一个全局变量，可是此全局变量的类型却没有相应的更新过来，就会导致 ts 编译错误，此时就需要扩展全局变量的类型。比如扩展 String 类型：

```javascript
interface String {
    prependHello(): string;
}

'foo'.prependHello();
```

通过声明合并，使用 interface String 即可给 String 添加属性或方法。

也可以使用 declare namespace 给已有的命名空间添加类型声明：

```javascript
// types/jquery-plugin/index.d.ts

declare namespace JQuery {
    interface CustomOptions {
        bar: string;
    }
}

interface JQueryStatic {
    foo(options: JQuery.CustomOptions): string;
}
// src/index.ts

jQuery.foo({
    bar: ''
});
```

#### 在NPM库或UMD库中扩展全局变量
如之前所说，对于一个 npm 包或者 UMD 库的声明文件，只有 export 导出的类型声明才能被导入。所以对于 npm 包或 UMD 库，如果导入此库之后会扩展全局变量，则需要使用另一种语法在声明文件中扩展全局变量的类型，那就是 declare global。

##### declare global
使用 declare global 可以在 npm 包或者 UMD 库的声明文件中扩展全局变量的类型：

```javascript
// types/foo/index.d.ts

declare global {
    interface String {
        prependHello(): string;
    }
}

export {};
// src/index.ts

'bar'.prependHello();
```

注意即使此声明文件不需要导出任何东西，仍然需要导出一个空对象，用来告诉编译器这是一个模块的声明文件，而不是一个全局变量的声明文件。

#### 模块插件
有时通过 import 导入一个模块插件，可以改变另一个原有模块的结构。此时如果原有模块已经有了类型声明文件，而插件模块没有类型声明文件，就会导致类型不完整，缺少插件部分的类型。ts 提供了一个语法 declare module，它可以用来扩展原有模块的类型。

##### declare module
如果是需要扩展原有模块的话，需要在类型声明文件中先引用原有模块，再使用 declare module 扩展原有模块：

```javascript
// types/moment-plugin/index.d.ts
import * as moment from 'moment';

declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
// src/index.ts

import * as moment from 'moment';
import 'moment-plugin';

moment.foo();
```

declare module 也可用于在一个文件中一次性声明多个模块的类型：

```javascript
// types/foo-bar.d.ts

declare module 'foo' {
    export interface Foo {
        foo: string;
    }
}

declare module 'bar' {
    export function bar(): string;
}
// src/index.ts

import { Foo } from 'foo';
import * as bar from 'bar';

let f: Foo;
bar.bar();
```

#### 声明文件中的依赖
一个声明文件有时会依赖另一个声明文件中的类型，比如在前面的 declare module 的例子中，我们就在声明文件中导入了 moment，并且使用了 moment.CalendarKey 这个类型：

```javascript
// types/moment-plugin/index.d.ts

import * as moment from 'moment';

declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
```

除了可以在声明文件中通过 import 导入另一个声明文件中的类型之外，还有一个语法也可以用来导入另一个声明文件，那就是三斜线指令。

##### 三斜线指令
与 namespace 类似，三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，**现在已经不建议再使用 ts 中的三斜线指令来声明模块之间的依赖关系了**。

但是在声明文件中，它还是有一定的用武之地。

类似于声明文件中的 import，它可以用来导入另一个声明文件。与 import 的区别是，当且仅当在以下几个场景下，我们才需要使用三斜线指令替代 import：

- 当我们在书写一个全局变量的声明文件时
- 当我们需要依赖一个全局变量的声明文件时
- 书写一个全局变量的声明文件

这些场景听上去很拗口，但实际上很好理解——**在全局变量的声明文件中，是不允许出现 import, export 关键字的**。一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。故当我们在书写一个全局变量的声明文件时，如果需要引用另一个库的类型，那么就必须用三斜线指令了：

```javascript
// types/jquery-plugin/index.d.ts

/// <reference types="jquery" />

declare function foo(options: JQuery.AjaxSettings): string;
// src/index.ts

foo({});
```

三斜线指令的语法如上，```/// ```后面使用 xml 的格式添加了对 jquery 类型的依赖，这样就可以在声明文件中使用 JQuery.AjaxSettings 类型了。

**注意，三斜线指令必须放在文件的最顶端，三斜线指令的前面只允许出现单行或多行注释**。

##### 依赖一个全局变量的声明文件
在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过 import 导入，当然也就必须使用三斜线指令来引入了：

```javascript
// types/node-plugin/index.d.ts

/// <reference types="node" />

export function foo(p: NodeJS.Process): string;
// src/index.ts

import { foo } from 'node-plugin';

foo(global.process);
```

在上面的例子中，我们通过三斜线指引入了 node 的类型，然后在声明文件中使用了 NodeJS.Process 这个类型。最后在使用到 foo 的时候，传入了 node 中的全局变量 process。

由于引入的 node 中的类型都是全局变量的类型，它们是没有办法通过 import 来导入的，所以这种场景下也只能通过三斜线指令来引入了。

以上两种使用场景下，都是由于需要书写或需要依赖全局变量的声明文件，所以必须使用三斜线指令。在其他的一些不是必要使用三斜线指令的情况下，就都需要使用 import 来导入。

##### 拆分声明文件
当我们的全局变量的声明文件太大时，可以通过拆分为多个文件，然后在一个入口文件中将它们一一引入，来提高代码的可维护性。比如 jQuery 的声明文件就是这样的：

```javascript
// node_modules/@types/jquery/index.d.ts

/// <reference types="sizzle" />
/// <reference path="JQueryStatic.d.ts" />
/// <reference path="JQuery.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="legacy.d.ts" />

export = jQuery;
```


其中用到了 types 和 path 两种不同的指令。它们的区别是：types 用于声明对另一个库的依赖，而 path 用于声明对另一个文件的依赖。

上例中，sizzle 是与 jquery 平行的另一个库，所以需要使用 types="sizzle" 来声明对它的依赖。而其他的三斜线指令就是将 jquery 的声明拆分到不同的文件中了，然后在这个入口文件中使用 path="foo" 将它们一一引入。

##### 其他三斜线指令
除了这两种三斜线指令之外，还有其他的三斜线指令，比如```/// <reference no-default-lib="true"/>, /// <amd-module /> ```等，但它们都是废弃的语法，故这里就不介绍了。


#### 自动生成声明文件
如果库的源码本身就是由 ts 写的，那么在使用 tsc 脚本将 ts 编译为 js 的时候，添加 declaration 选项，就可以同时也生成 .d.ts 声明文件了。

我们可以在命令行中添加 --declaration（简写 -d），或者在 tsconfig.json 中添加 declaration 选项。这里以 tsconfig.json 为例：

```javascript
{
    "compilerOptions": {
        "module": "commonjs",
        "outDir": "lib",
        "declaration": true,
    }
}
```

上例中我们添加了 outDir 选项，将 ts 文件的编译结果输出到 lib 目录下，然后添加了 declaration 选项，设置为 true，表示将会由 ts 文件自动生成 .d.ts 声明文件，也会输出到 lib 目录下。

运行 tsc 之后，目录结构如下：
![](/images/assets/20200624155129508.png)
在这个例子中，src 目录下有两个 ts 文件，分别是 src/index.ts 和 src/bar/index.ts，它们被编译到 lib 目录下的同时，也会生成对应的两个声明文件 lib/index.d.ts 和 lib/bar/index.d.ts。它们的内容分别是：

```javascript
// src/index.ts
export * from './bar';
export default function foo() {
    return 'foo';
}

// src/bar/index.ts
export function bar() {
    return 'bar';
}

// lib/index.d.ts
export * from './bar';
export default function foo(): string;

// lib/bar/index.d.ts
export declare function bar(): string;
```

可见，自动生成的声明文件基本保持了源码的结构，而将具体实现去掉了，生成了对应的类型声明。

使用 tsc 自动生成声明文件时，每个 ts 文件都会对应一个 .d.ts 声明文件。这样的好处是，使用方不仅可以在使用 import foo from 'foo' 导入默认的模块时获得类型提示，还可以在使用 import bar from 'foo/lib/bar' 导入一个子模块时，也获得对应的类型提示。

除了 declaration 选项之外，还有几个选项也与自动生成声明文件有关，这里只简单列举出来，不做详细演示了：

- declarationDir 设置生成 .d.ts 文件的目录
- declarationMap 对每个 .d.ts 文件，都生成对应的 .d.ts.map（sourcemap）文件
- emitDeclarationOnly 仅生成 .d.ts 文件，不生成 .js 文件

## 进阶
### 类型别名
类型别名用来给一个类型起个新名字。

简单的例子

```javascript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```

上例中，我们使用 type 创建类型别名。

类型别名常用于联合类型。


### 字符串字面量类型
字符串字面量类型用来约束取值只能是某几个字符串中的一个。

简单的例子

```javascript
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'

// index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
```

上例中，我们使用 type 定了一个字符串字面量类型 EventNames，它只能取三种字符串中的一种。

注意，**类型别名与字符串字面量类型都是使用 type 进行定义**


### 元组
数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

元组起源于函数编程语言（如 F#），这些语言中会频繁使用元组。

简单的例子：
定义一对值分别为 string 和 number 的元组：

```javascript
let tom: [string, number] = ['Tom', 25];
```

当赋值或访问一个已知索引的元素时，会得到正确的类型：

```javascript
let tom: [string, number];
tom[0] = 'Tom';
tom[1] = 25;

tom[0].slice(1);
tom[1].toFixed(2);
```

也可以只赋值其中一项：

```javascript
let tom: [string, number];
tom[0] = 'Tom';
```

但是当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项。

```javascript
let tom: [string, number];
tom = ['Tom', 25];
let tom: [string, number];
tom = ['Tom'];

// Property '1' is missing in type '[string]' but required in type '[string, number]'.
```

越界的元素：
当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型：

```javascript
let tom: [string, number];
tom = ['Tom', 25];
tom.push('male');
tom.push(true);

// Argument of type 'true' is not assignable to parameter of type 'string | number'.
```


### 枚举
枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等。

简单的例子:
枚举使用 enum 关键字来定义：

```javascript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
```

枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

```javascript
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
```

事实上，上面的例子会被编译为：

```javascript
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

**我们也可以给枚举项手动赋值：**

```javascript
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true
```

上面的例子中，未手动赋值的枚举项会接着上一个枚举项递增。

**如果未手动赋值的枚举项与手动赋值的重复了，TypeScript 是不会察觉到这一点的：**

```javascript
enum Days {Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 3); // true
console.log(Days["Wed"] === 3); // true
console.log(Days[3] === "Sun"); // false
console.log(Days[3] === "Wed"); // true
```

上面的例子中，递增到 3 的时候与前面的 Sun 的取值重复了，但是 TypeScript 并没有报错，导致 Days[3] 的值先是 "Sun"，而后又被 "Wed" 覆盖了。编译的结果是：

```javascript
var Days;
(function (Days) {
    Days[Days["Sun"] = 3] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

**所以使用的时候需要注意，最好不要出现这种覆盖的情况。**

手动赋值的枚举项可以不是数字，此时需要使用类型断言来让 tsc 无视类型检查 (编译出的 js 仍然是可用的)：

```javascript
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
var Days;
(function (Days) {
    Days[Days["Sun"] = 7] = "Sun";
    Days[Days["Mon"] = 8] = "Mon";
    Days[Days["Tue"] = 9] = "Tue";
    Days[Days["Wed"] = 10] = "Wed";
    Days[Days["Thu"] = 11] = "Thu";
    Days[Days["Fri"] = 12] = "Fri";
    Days[Days["Sat"] = "S"] = "Sat";
})(Days || (Days = {}));
```

当然，手动赋值的枚举项也可以为小数或负数，此时后续未手动赋值的项的递增步长仍为 1：

```javascript
enum Days {Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1.5); // true
console.log(Days["Tue"] === 2.5); // true
console.log(Days["Sat"] === 6.5); // true
```

##### 常数项和计算所得项
枚举项有两种类型：**常数项（constant member）和计算所得项（computed member）。**

前面我们所举的例子都是常数项，一个典型的计算所得项的例子：

```javascript
enum Color {Red, Green, Blue = "blue".length};
```

上面的例子中，"blue".length 就是一个计算所得项。

上面的例子不会报错，但是**如果紧接在计算所得项后面的是未手动赋值的项，那么它就会因为无法获得初始值而报错**：

```javascript
enum Color {Red = "red".length, Green, Blue};

// index.ts(1,33): error TS1061: Enum member must have initializer.
// index.ts(1,40): error TS1061: Enum member must have initializer.
```

下面是常数项和计算所得项的完整定义：

当满足以下条件时，枚举成员被当作是常数：

- 不具有初始化函数并且之前的枚举成员是常数。在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。
- 枚举成员使用常数枚举表达式初始化。常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：
1. 数字字面量
2. 引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用
3. 带括号的常数枚举表达式
4. ```+, -, ~ ```一元运算符应用于常数枚举表达式
5. ```+, -, *, /, %, <<, >>, >>>, &, |, ^ ```二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为 NaN 或 Infinity，则会在编译阶段报错

所有其它情况的枚举成员被当作是需要计算得出的值。

##### 常数枚举
常数枚举是使用 const enum 定义的枚举类型：

```javascript
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

**常数枚举与普通枚举的区别是，它会在编译阶段被删除**，并且**不能包含计算成员**。

上例的编译结果是：

```javascript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

假如包含了计算成员，则会在编译阶段报错：

```javascript
const enum Color {Red, Green, Blue = "blue".length};

// index.ts(1,38): error TS2474: In 'const' enum declarations member initializer must be constant expression.
```

##### 外部枚举
外部枚举（Ambient Enums）是使用 declare enum 定义的枚举类型：

```javascript
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

之前提到过，declare 定义的类型只会用于编译时的检查，编译结果中会被删除。

上例的编译结果是：

```javascript
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

外部枚举与声明语句一样，常出现在声明文件中。

同时使用 declare 和 const 也是可以的：

```javascript
declare const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

编译结果：

```javascript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

TypeScript 的枚举类型的概念来源于 C#。


### 类
传统方法中，JavaScript 通过构造函数实现类的概念，通过原型链实现继承。而在 ES6 中，我们终于迎来了 class。

TypeScript 除了实现了所有 ES6 中的类的功能以外，还添加了一些新的用法。

这一节主要介绍类的用法，下一节再介绍如何定义类的类型。

#### 类的概念
虽然 JavaScript 中有类的概念，但是可能大多数 JavaScript 程序员并不是非常熟悉类，这里对类相关的概念做一个简单的介绍。

- 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法
- 对象（Object）：类的实例，通过 new 生成
- 面向对象（OOP）的三大特性：封装、继承、多态
- 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
- 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
- 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行 eat
- 存取器（getter & setter）：用以改变属性的读取和赋值行为
- 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法
- 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

#### ES6 中类的用法
下面我们先回顾一下 ES6 中类的用法。

##### 属性和方法
使用 class 定义类，使用 constructor 定义构造函数。

通过 new 生成新实例的时候，会自动调用构造函数。

```javascript
class Animal {
    public name;
    constructor(name) {
        this.name = name;
    }
    sayHi() {
        return `My name is ${this.name}`;
    }
}

let a = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

##### 类的继承
使用 extends 关键字实现继承，子类中使用 super 关键字来调用父类的构造函数和方法。

```javascript
class Cat extends Animal {
  constructor(name) {
    super(name); // 调用父类的 constructor(name)
    console.log(this.name);
  }
  sayHi() {
    return 'Meow, ' + super.sayHi(); // 调用父类的 sayHi()
  }
}

let c = new Cat('Tom'); // Tom
console.log(c.sayHi()); // Meow, My name is Tom
```

##### 存取器
使用 getter 和 setter 可以改变属性的赋值和读取行为：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return 'Jack';
  }
  set name(value) {
    console.log('setter: ' + value);
  }
}

let a = new Animal('Kitty'); // setter: Kitty
a.name = 'Tom'; // setter: Tom
console.log(a.name); // Jack
```

##### 静态方法
使用 static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用：

```javascript
class Animal {
  static isAnimal(a) {
    return a instanceof Animal;
  }
}

let a = new Animal('Jack');
Animal.isAnimal(a); // true
a.isAnimal(a); // TypeError: a.isAnimal is not a function
```

#### ES7 中类的用法
ES7 中有一些关于类的提案，TypeScript 也实现了它们，这里做一个简单的介绍。

##### 实例属性
ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 提案中可以直接在类里面定义：

```javascript
class Animal {
  name = 'Jack';

  constructor() {
    // ...
  }
}

let a = new Animal();
console.log(a.name); // Jack
```

##### 静态属性
ES7 提案中，可以使用 static 定义一个静态属性：

```javascript
class Animal {
  static num = 42;

  constructor() {
    // ...
  }
}

console.log(Animal.num); // 42
```

#### TypeScript 中类的用法
##### public private 和 protected
TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 **public、private 和 protected**。

- public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
- private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的
下面举一些例子：

```javascript
class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';
console.log(a.name); // Tom
```

上面的例子中，name 被设置为了 public，所以直接访问实例的 name 属性是允许的。

很多时候，我们希望有的属性是无法直接存取的，这时候就可以用 private 了：

```javascript
class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';

// index.ts(9,13): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
// index.ts(10,1): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
```

**需要注意的是，TypeScript 编译之后的代码中，并没有限制 private 属性在外部的可访问性。**

上面的例子编译后的代码是：

```javascript
var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var a = new Animal('Jack');
console.log(a.name);
a.name = 'Tom';
```

使用 private 修饰的属性或方法，在子类中也是不允许访问的：

```javascript
class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}

// index.ts(11,17): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
```


而如果是用 protected 修饰，则允许在子类中访问：

```javascript
class Animal {
  protected name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}
```

当构造函数修饰为 private 时，该类不允许被继承或者实例化：

```javascript
class Animal {
  public name;
  private constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');

// index.ts(7,19): TS2675: Cannot extend a class 'Animal'. Class constructor is marked as private.
// index.ts(13,9): TS2673: Constructor of class 'Animal' is private and only accessible within the class declaration.
```

当构造函数修饰为 protected 时，该类只允许被继承：

```javascript
class Animal {
  public name;
  protected constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');

// index.ts(13,9): TS2674: Constructor of class 'Animal' is protected and only accessible within the class declaration.
```

##### 参数属性
修饰符和readonly还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁。

```javascript
class Animal {
  // public name: string;
  public constructor(public name) {
    // this.name = name;
  }
}
```

##### readonly
只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

```javascript
class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';

// index.ts(10,3): TS2540: Cannot assign to 'name' because it is a read-only property.
```

注意如果 readonly 和其他访问修饰符同时存在的话，需要写在其后面。

```javascript
class Animal {
  // public readonly name;
  public constructor(public readonly name) {
    // this.name = name;
  }
}
```

##### 抽象类
abstract 用于定义抽象类和其中的抽象方法。

什么是抽象类？

首先，抽象类是不允许被实例化的：

```javascript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

let a = new Animal('Jack');

// index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
```

上面的例子中，我们定义了一个抽象类 Animal，并且定义了一个抽象方法 sayHi。在实例化抽象类的时候报错了。

其次，抽象类中的抽象方法必须被子类实现：

```javascript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public eat() {
    console.log(`${this.name} is eating.`);
  }
}

let cat = new Cat('Tom');

// index.ts(9,7): error TS2515: Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
```

上面的例子中，我们定义了一个类 Cat 继承了抽象类 Animal，但是没有实现抽象方法 sayHi，所以编译报错了。

下面是一个正确使用抽象类的例子：

```javascript
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new Cat('Tom');
```

上面的例子中，我们实现了抽象方法 sayHi，编译通过了。

需要注意的是，即使是抽象方法，TypeScript 的编译结果中，仍然会存在这个类，上面的代码的编译结果是：

```javascript
var __extends =
  (this && this.__extends) ||
  function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  };
var Animal = (function () {
  function Animal(name) {
    this.name = name;
  }
  return Animal;
})();
var Cat = (function (_super) {
  __extends(Cat, _super);
  function Cat() {
    _super.apply(this, arguments);
  }
  Cat.prototype.sayHi = function () {
    console.log('Meow, My name is ' + this.name);
  };
  return Cat;
})(Animal);
var cat = new Cat('Tom');
```

##### 类的类型
给类加上 TypeScript 的类型很简单，与接口类似：

```javascript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sayHi(): string {
    return `My name is ${this.name}`;
  }
}

let a: Animal = new Animal('Jack');
console.log(a.sayHi()); // My name is Jack
```

### 类与接口
之前学习过，接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述。

这一章主要介绍接口的另一个用途，对类的一部分行为进行抽象。

#### 类实现接口
实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现。这个特性大大提高了面向对象的灵活性。

举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：

```javascript
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

一个类可以实现多个接口：

```javascript
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

上例中，Car 实现了 Alarm 和 Light 接口，既能报警，也能开关车灯。

#### 接口继承接口
接口与接口之间可以是继承关系：

```javascript
interface Alarm {
    alert(): void;
}

interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

这很好理解，LightableAlarm 继承了 Alarm，除了拥有 alert 方法之外，还拥有两个新方法 lightOn 和 lightOff。

#### 接口继承类
常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的：

```javascript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

为什么 TypeScript 会支持接口继承类呢？

实际上，当我们在声明 class Point 时，除了会创建一个名为 Point 的类之外，同时也创建了一个名为 Point 的类型（实例的类型）。

所以我们既可以将 Point 当做一个类来用（使用 new Point 创建它的实例）：

```javascript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const p = new Point(1, 2);
```

也可以将 Point 当做一个类型来用（使用 : Point 表示参数的类型）：

```javascript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function printPoint(p: Point) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

这个例子实际上可以等价于：

```javascript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

function printPoint(p: PointInstanceType) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```

上例中我们新声明的 PointInstanceType 类型，与声明 class Point 时创建的 Point 类型是等价的。

所以回到 Point3d 的例子中，我们就能很容易的理解为什么 TypeScript 会支持接口继承类了：

```javascript
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

// 等价于 interface Point3d extends PointInstanceType
interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```


当我们声明 interface Point3d extends Point 时，Point3d 继承的实际上是类 Point 的实例的类型。

换句话说，可以理解为定义了一个接口 Point3d 继承另一个接口 PointInstanceType。

**所以「接口继承类」和「接口继承接口」没有什么本质的区别。**

值得注意的是，PointInstanceType 相比于 Point，缺少了 constructor 方法，这是因为声明 Point 类时创建的 Point 类型是不包含构造函数的。另外，除了构造函数是不包含的，静态属性或静态方法也是不包含的（实例的类型当然不应该包括构造函数、静态属性或静态方法）。

换句话说，声明 Point 类时创建的 Point 类型只包含其中的实例属性和实例方法：

```javascript
class Point {
    /** 静态属性，坐标系原点 */
    static origin = new Point(0, 0);
    /** 静态方法，计算与原点距离 */
    static distanceToOrigin(p: Point) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }
    /** 实例属性，x 轴的值 */
    x: number;
    /** 实例属性，y 轴的值 */
    y: number;
    /** 构造函数 */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    /** 实例方法，打印此点 */
    printPoint() {
        console.log(this.x, this.y);
    }
}

interface PointInstanceType {
    x: number;
    y: number;
    printPoint(): void;
}

let p1: Point;
let p2: PointInstanceType;
```

上例中最后的类型 Point 和类型 PointInstanceType 是等价的。

同样的，在接口继承类的时候，也只会继承它的实例属性和实例方法。

### 泛型
泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

简单的例子
首先，我们来实现一个函数 createArray，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值：

```javascript
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```


上例中，我们使用了之前提到过的数组泛型来定义返回值的类型。

这段代码编译不会报错，但是一个显而易见的缺陷是，它并没有准确的定义返回值的类型：

```Array<any> ```允许数组的每一项都为任意类型。但是我们预期的是，数组中每一项都应该是输入的 value 的类型。

这时候，泛型就派上用场了：

```javascript
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

上例中，我们在函数名后添加了 ```<T>```，其中 T 用来指代任意输入的类型，在后面的输入```value: T ```和输出 ```Array<T>```中即可使用了。

接着在调用的时候，可以指定它具体的类型为 string。当然，也可以不手动指定，而让类型推论自动推算出来：

```javascript
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

#### 多个类型参数
定义泛型的时候，可以一次定义多个类型参数：

```javascript
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

上例中，我们定义了一个 swap 函数，用来交换输入的元组。

#### 泛型约束
在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法：

```javascript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'T'.
```

上例中，泛型 T 不一定包含属性 length，所以编译的时候报错了。

这时，我们可以对泛型进行约束，只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束：

```javascript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

上例中，我们使用了 extends 约束了泛型 T 必须符合接口 Lengthwise 的形状，也就是必须包含 length 属性。

此时如果调用 loggingIdentity 的时候，传入的 arg 不包含 length，那么在编译阶段就会报错了：

```javascript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

loggingIdentity(7);

// index.ts(10,17): error TS2345: Argument of type '7' is not assignable to parameter of type 'Lengthwise'.
```

多个类型参数之间也可以互相约束：

```javascript
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```

上例中，我们使用了两个类型参数，其中要求 T 继承 U，这样就保证了 U 上不会出现 T 中不存在的字段。

#### 泛型接口
之前学习过，可以使用接口的方式来定义一个函数需要符合的形状：

```javascript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

当然也可以使用含有泛型的接口来定义函数的形状：

```javascript
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

进一步，我们可以把泛型参数提前到接口名上：

```javascript
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

注意，此时在使用泛型接口的时候，需要定义泛型的类型。

#### 泛型类
与泛型接口类似，泛型也可以用于类的类型定义中：

```javascript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

#### 泛型参数的默认类型
在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

```javascript
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```
