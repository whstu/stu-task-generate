const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

// 保存名单接口
app.post('/save-names', async (req, res) => {
  try {
    const names = req.body.names;
    // 将数组转换为文本格式,每行一个名字
    const content = names.join('\n');
    await fs.writeFile(
      path.join(__dirname, 'data/namelist.txt'),
      content,
      'utf8'
    );
    res.send('保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    res.status(500).send('保存失败');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`开发服务器运行在 http://localhost:${PORT}`);
});
