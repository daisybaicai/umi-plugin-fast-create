// ref:
// - https://umijs.org/plugins/api
import { join, resolve } from 'path';
import { IApi } from '@umijs/types';
import strategy from './strategy/index';
import { readFile } from './utils/fs';
import { StandardSwagger } from './utils/data';

var handleText = function(type: any, text: any, api: any) {
  return strategy[type](api, text);
};

export default function(api: IApi) {
  api.logger.info('use plugin');


  // @ts-ignore
  api.addUIPlugin(() => join(__dirname, '../dist/index.umd.js'));

  // @ts-ignore
  api.onUISocket(({ action, failure, success }) => {
    const actionType = action.type.replace(/org.plugin.template./, '');

    if (action.type === 'org.plugin.template.list') {
      handleText(actionType, action.payload.text, api);
    }
    if (action.type === 'org.plugin.template.form') {
      handleText(actionType, action.payload.text, api);
    }
    if (action.type === 'org.plugin.template.detail') {
      handleText(actionType, action.payload.text, api);
    }
    if (action.type === 'org.plugin.swagger.create') {
      // 检查当前目录下是否有api-docs.json文件

      const cwdPath = api.paths.cwd;
      
      readFile(`${cwdPath}/api-docs.json`).then(res => {
        const JSONData = JSON.parse(res);        
        const swagger = new StandardSwagger(JSONData);
        // console.log('success');
        
        success({
          data: res
        })
        // console.log('tags', JSONData.tags);
        
        // 共享变量
      }).catch(err => {
        failure(err)
      });
    }
  });
}
