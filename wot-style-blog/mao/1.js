const fs = require('fs');
const path = require('path');

// 定义正则表达式来校验文件名格式 {xxx}_{xxx}_{xxx}.html，其中 xxx 是中文
const regex = /^[^_]+_[^_]+_[^_]+\.html$/;

// 读取当前目录下的所有文件
fs.readdir(__dirname, (err, files) => {
  if (err) {
    console.error('读取目录失败', err);
    return;
  }

  // 过滤符合要求的HTML文件
  const validFiles = files.filter(file => regex.test(file));

  // 将符合要求的文件名保存到 path.txt
  fs.writeFile(path.join(__dirname, 'path.txt'), validFiles.join('\n'), (err) => {
    if (err) {
      console.error('写入文件失败', err);
    } else {
      console.log('文件保存成功！');
    }
  });
});
