// ref:
// - https://umijs.org/plugins/api
import { join, resolve } from 'path';
import { IApi } from '@umijs/types';
import strategy from './strategy/index';
import { readFile } from './utils/fs';
import { StandardSwagger } from './utils/data';
import { getOptions } from './utils/options';

var handleText = function(type: any, text: any, api: any, options: any) {
  return strategy[type](api, text, options);
};

export default function(api: IApi) {
  const options = getOptions(api.paths.cwd);

  api.logger.info('use plugin');

  // @ts-ignore
  api.addUIPlugin(() => join(__dirname, '../dist/index.umd.js'));

  // @ts-ignore
  api.onUISocket(({ action, failure, success }) => {
    const actionType = action.type.replace(/org.plugin.template./, '');

    if(action.type === 'org.plugin.template.options') {
      success({
        data: options
      })
    }

    if (action.type === 'org.plugin.template.list') {
      handleText(actionType, action.payload.text, api, options);
      success({
        data: "成功"
      })
    }
    if (action.type === 'org.plugin.template.form') {
      handleText(actionType, action.payload.text, api, options);
      success({
        data: "成功"
      })
    }
    if (action.type === 'org.plugin.template.detail') {
      handleText(actionType, action.payload.text, api, options);
      success({
        data: "成功"
      })
    }
    if (action.type === 'org.plugin.template.api') {
      handleText(actionType, action.payload.text, api, options);
      success({
        data: "成功"
      })
    }
    if (action.type === 'org.plugin.template.action') {      
      handleText(actionType, action.payload.text, api, options);
      success({
        data: "成功"
      })
    }
    if (action.type === 'org.plugin.swagger.create') {
      // 检查当前目录下是否有api-docs.json文件

      const cwdPath = api.paths.cwd;
      
      readFile(`${cwdPath}/api-docs.json`).then(res => {
        const JSONData = JSON.parse(res);        
        const swagger = new StandardSwagger(JSONData);        
        success({
          data: res
        })
        
        // 共享变量
      }).catch(err => {
        failure(err)
      });
    }
  });
}
