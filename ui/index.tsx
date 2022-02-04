import { IUiApi } from '@umijs/ui-types';
import { Button } from 'antd';
import React from 'react';
import SelectTable from './components/SelectTables';
import './global.less';
import { setLocalStorage } from './utils/utils';


export default (api: IUiApi) => {
  const { callRemote } = api;

  function PluginPanel() {
    return (
      <>
        <div>
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
