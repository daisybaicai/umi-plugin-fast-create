import { Button, Input, Modal } from 'antd';
import { IUiApi } from '@umijs/ui-types';
import React, { useState } from 'react';
import { setLocalStorage } from './utils/utils';
import SelectTable from './components/SelectTables';

function OpenCompents(props: any) {
  const { type = '', handleText = () => {} } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [value, setValue] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
    // TODO:暂时去掉，用默认
    // setValue('');
    setValue(`

    {
      modelName: "login",
       api: {
         url: "/api/v1/login",
         methods: "GET",
         params: [
              {   
                  name: "baseName",
                  description: "基地名称",
              }
          ],
         description: "登录",
         response: {
          properties: {
              baseName: {
                  type: "string",
                  description: "基地名称"
              },
              companyName: {
                  type: "string",
                  description: "企业名称"
              },
              dataYearMonth: {
                  type: "string",
                  description: "数据年月, 使用字符串格式, yyyyMM, 如202003"
              },
              exportAmount: {
                  type: "number",
                  description: "出口额(亿)"
              },
              id: {
                  type: "integer",
                  format: "int32",
                  description: "数据id, 数据库自增"
              },
              output: {
                  type: "string",
                  description: "产量"
              },
              productCategoryTypeEnum: {
                  type: "string",
                  description: "产品分类",
                  enum: [
                      "AGRICULTURAL_PRODUCT",
                      "ALL",
                      "BUILDING_MATERIALS",
                      "CHEMICAL_PHARMACEUTICAL",
                      "LIGHT_INDUSTRY",
                      "MECHATRONICS",
                      "OTHERS",
                      "TEXTILE"
                  ]
              },
              productName: {
                  type: "string",
                  description: "产品名称"
              },
              productValue: {
                  type: "number",
                  description: "产值(亿)"
              },
              saleAmount: {
                  type: "number",
                  description: "销售额(亿)"
              },
              saleQuantity: {
                  type: "string",
                  description: "销售量"
              },
              tax: {
                  type: "number",
                  description: "税收(亿)"
              }
          },
         }
       },
      componentsName: "login",
      componentsPath: "/Login/List/",
    }
`);
  };

  const handleOk = () => {
    if (!value) {
      return;
    }
    handleText(value);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <Button onClick={showModal}>{type}</Button>
      <Modal
        title={type}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input.TextArea
          rows={10}
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
        ></Input.TextArea>
      </Modal>
    </div>
  );
}

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
          <OpenCompents
            type="list"
            handleText={async (text: any) => {
              await callRemote({
                type: 'org.plugin.template.list',
                payload: {
                  text,
                },
              });
            }}
          />
          <OpenCompents
            type="form"
            handleText={async (text: any) => {
              await callRemote({
                type: 'org.plugin.template.form',
                payload: {
                  text,
                },
              });
            }}
          />
          <OpenCompents
            type="detail"
            handleText={async (text: any) => {
              await callRemote({
                type: 'org.plugin.template.detail',
                payload: {
                  text,
                },
              });
            }}
          />
          <SelectTable api={api}/>
        </div>
      </>
    );
  }

  api.addPanel({
    title: 'demo',
    path: '/demo',
    icon: 'home',
    component: PluginPanel,
  });
};
