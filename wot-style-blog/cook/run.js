const fs = require('fs');
const path = require('path');

// 定义分类
const categories = {
  aquatic: '水产',
  breakfast: '早餐',
  condiment: '酱料和其他材料',
  dessert: '甜品',
  drink: '饮品',
  meat_dish: '荤菜',
  vegetable_dish: '素菜',
  semi_finished: '半成品加工',
  soup: '汤和粥',
  staple: '主食'
};

// 递归查找md文件
function findMdFiles(dir, category) {
  let results = [];
  
  // 读取文件夹内容
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // 如果是文件夹，递归查找
    if (stat.isDirectory()) {
      results = results.concat(findMdFiles(fullPath, category));
    } else if (file.endsWith('.md')) {
      // 如果是md文件，加入结果
      results.push({ filePath: fullPath, category });
    }
  }

  return results;
}

// 解析md文件中的烹饪难度
function parseDifficulty(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const regex = /预估烹饪难度：(★*)/;
  const match = content.match(regex);
  if (match) {
    return match[1].length;  // 返回星级数量
  }
  return null;  // 如果没有匹配，返回null
}

// 主函数
function main() {
  const dishesDir = path.join(__dirname, 'dishes');
  let allResults = [];

  // 遍历每个分类文件夹，找到所有md文件
  for (let [categoryKey, categoryName] of Object.entries(categories)) {
    const categoryDir = path.join(dishesDir, categoryKey);
    if (fs.existsSync(categoryDir)) {
      const files = findMdFiles(categoryDir, categoryName);
      for (let file of files) {
        const difficulty = parseDifficulty(file.filePath);
        const relativePath = path.relative(dishesDir, file.filePath).replace(/\\/g, '/');
        allResults.push({
          title: path.basename(file.filePath),
          cat: file.category,
          path: '/' + relativePath,
          star: difficulty !== null ? difficulty : '无'
        });
      }
    }
  }

  // 将结果写入ts文件
  const outputPath = path.join(__dirname, 'result.ts');
  const outputData = `
const result = ${JSON.stringify(allResults, null, 2)};
export default result;
`;

  fs.writeFileSync(outputPath, outputData, 'utf-8');
  console.log('处理完成，结果已保存到 result.ts');
}

// 执行主函数
main();
