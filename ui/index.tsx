import { IUiApi } from '@umijs/ui-types';
import { Button } from 'antd';
import React from 'react';
import SelectTable from './components/SelectTables';
import { setLocalStorage } from './utils/utils';
import './global.less'


export default (api: IUiApi) => {
  const { callRemote } = api;

  function PluginPanel() {
    return (
      <>
        <div>
          <Button
            onClick={async (text: any) => {
              const { data } = await callRemote({
                type: 'org.plugin.swagger.create',
              });
              setLocalStorage('swagger-data', data);
              alert(data);
            }}
          >
            生成swagger数据流
          </Button>
          <SelectTable api={api}/>
        </div>
      </>
    );
  }

  api.addPanel({
    title: '配置',
    path: '/demo',
    component: PluginPanel,
  });
};
