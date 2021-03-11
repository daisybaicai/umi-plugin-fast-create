// ref:
// - https://umijs.org/plugins/api
import { join, resolve } from 'path';
import { IApi } from '@umijs/types';
import strategy from './strategy/index';


var handleText = function(type: any,text: any, api: any) {  
  return strategy[type](api, text);
};

export default function (api: IApi) {
  api.logger.info('use plugin');

  // api.modifyHTML(($) => {
  //   $('body').prepend(`<h1>hello umi plugin</h1>`);
  //   return $;
  // });

  // @ts-ignore
  api.addUIPlugin(() => join(__dirname, '../dist/index.umd.js'));

  // @ts-ignore
  api.onUISocket(({ action, failure, success }) => {
    const actionType = action.type.replace(/org.plugin.template./, "");

    if(action.type === 'org.plugin.template.list') {
      handleText(actionType, action.payload.text, api);
    }
    if(action.type === 'org.plugin.template.form') {
      handleText(actionType, action.payload.text, api);
    }
    if(action.type === 'org.plugin.template.detail') {
      handleText(actionType, action.payload.text, api);
    }
  });

}

