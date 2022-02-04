import fs from 'fs';

export const getOptions = (p) => {
  let optionsTemplate = {
    prefix: '/api',
    ignored: {
      params: [],
      response: [],
    },
  };

  let options;
  const cwdPath = p;
  // 获取主题 json 配置文件
  const themeConfigPath = cwdPath + '/fast.config.json';

  if (fs.existsSync(themeConfigPath)) {
    options = require(themeConfigPath)
  }
  if(!options || JSON.stringify(options) === '{}') {
    options = optionsTemplate;
  }
  return options;
};
