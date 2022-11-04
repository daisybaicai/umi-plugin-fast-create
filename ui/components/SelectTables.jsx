import React, { useContext } from 'react';
import { Table, Button, Form, Modal, Input, Space, Select, Switch } from 'antd';
import { getParams, getResponse, getTransformArr } from '../utils/data';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/utils';
import styles from './index.less';
import { DIALOG_FORM_REF_TYPE, DIALOG_TYPE, POSITION_TYPE } from '../common/enum';

const DictCustomSelect = React.forwardRef(
  ({ data = {}, value = undefined, onChange = () => {} }, ref) => {
    return (
      <Select
        placeholder="请选择"
        style={{ width: '100%' }}
        ref={ref}
        value={value}
        onChange={onChange}
      >
        {Object.keys(data).map(k => (
          <Select.Option key={data[k]?.desc} value={data[k]?.code}>
            {data[k]?.desc}
          </Select.Option>
        ))}
      </Select>
    );
  },
);

function SelectTable({ api }) {
  const [form] = Form.useForm();

  const [type, setType] = useState(null);

  const [options, setOptions] = useState({});

  const handleShow = (record, t) => {
    setType(t);
    if (record.children) {
      return;
    }

    setVisible(true);
    const params = getParams(record);
    const response = getResponse(record);

    const {
      ignored: { params: pIg = [], response: rIg = [] },
    } = options;

    // 'api', 'params'
    form.setFieldsValue({
      api: {
        description: record.description || '',
        methods: record.method,
        url: record.url,
        params: params?.filter(item => !pIg.includes(item?.name)) || [],
        response: response?.filter(item => !rIg.includes(item?.name)) || [],
      },
    });
  };

  const columns = [
    { title: 'tags', dataIndex: 'tags' },
    { title: 'id', dataIndex: 'id' },
    { title: '类型', dataIndex: 'method', key: 'method' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: 'url', dataIndex: 'url', key: 'url' },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <a onClick={() => handleShow(record, 'list')}>列表</a>
          <a onClick={() => handleShow(record, 'form')}>form</a>
          <a onClick={() => handleShow(record, 'detail')}>detail</a>
          {/* <a onClick={() => handleShow(record, 'api')}>api 生成</a> */}
          {/* <a onClick={() => handleShow(record, 'action')}>columns操作</a>
          <a onClick={() => handleShow(record, 'dialog')}>弹框提问</a> */}
          <a onClick={() => handleShow(record, 'dialog')}>弹框提问</a>
        </Space>
      ),
      // <a onClick={() => handleShow(record)}>查看</a>,
    },
  ];

  const [visible, setVisible] = useState(false);

  const [initialObjects, setInitialObjects] = useState({});

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const handleOk = () => {
    form.validateFields().then(async values => {
      // async () => {
      const { api: apiInfos = {}, ...rest } = values;
      let res = [];
      if (apiInfos?.response) {
        res = apiInfos?.response;
      }
      apiInfos.response = res;
      const payload = {
        ...rest,
        api: apiInfos,
      };
      const { data } = await api.callRemote({
        type: `org.plugin.template.${type}`,
        payload: {
          text: JSON.stringify(payload),
        },
      });
      if (data) {
        setVisible(false);
      }
      // }
    });
  };

  return (
    <>
      <Button
        onClick={async () => {
          if (!options?.url) {
            alert('暂无匹配url');
            return;
          }
          fetch(options?.url, {
            headers: {
              'access-control-allow-origin': '*',
            },
          })
            .then(response => {
              return response.json(); // 先将结果转换为 JSON 对象
            })
            .then(data => {
              console.log(JSON.stringify(data));
              alert(JSON.stringify(data))
              setLocalStorage('swagger-data', JSON.stringify(data));
            })
            .catch(function(error) {
              api.logger.error(error);
            });
        }}
      >
        生成swagger数据流
      </Button>
      <Button
        onClick={() => {
          const res = getLocalStorage('swagger-data');
          alert(res);
          setInitialObjects(JSON.parse(res).paths);
        }}
      >
        填充table
      </Button>
      <Button
        onClick={async () => {
          const { data } = await api.callRemote({
            type: `org.plugin.template.options`,
          });
          alert(JSON.stringify(data));
          setOptions(data);
        }}
      >
        获取options
      </Button>
      <div className={styles.container}>
        <Table
          styles={{ background: 'white' }}
          scroll={{ x: 1500, y: '70vh' }}
          columns={columns}
          rowKey={record => record.url || record.tags}
          rowSelection={{ ...rowSelection, checkStrictly: false }}
          dataSource={getTransformArr(initialObjects)}
        />
      </div>
      <Modal
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form}>
          <Form.Item label="model名称" name="modelName">
            <Input />
          </Form.Item>
          <Form.Item label="componentsName" name="componentsName">
            <Input />
          </Form.Item>
          <Form.Item label="componentsPath" name="componentsPath">
            <Input />
          </Form.Item>
          <Form.Item label="isCreate" name="isCreate" valuePropName="checked">
            <Switch />
          </Form.Item>
          {type === 'dialog' && (
            <>
              <Form.Item label="handleName" name="handleName">
                <Input />
              </Form.Item>
              <Form.Item label="modalParams" name="modalParams">
                <Input />
              </Form.Item>
              <Form.Item label="modalForm" name="modalForm">
                <Input />
              </Form.Item>
              {/* <Form.Item label="弹框类型" name="dialogType">
                <DictCustomSelect data={DIALOG_TYPE} />
              </Form.Item>
              <Form.Item label="弹框formRef" name="dialogFormRef">
                <DictCustomSelect data={DIALOG_FORM_REF_TYPE} />
              </Form.Item> */}
            </>
          )}
          <Form.Item label="api相关" name="api">
            <Form.Item label="url" name={['api', 'url']}>
              <Input />
            </Form.Item>
            <Form.Item label="methods" name={['api', 'methods']}>
              <Input />
            </Form.Item>
            <Form.Item label="description" name={['api', 'description']}>
              <Input />
            </Form.Item>
            <Form.Item label="params">
              <Form.List name={['api', 'params']}>
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(
                      ({ key, name, fieldKey, ...restField }, index) => (
                        <Space
                          key={key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            fieldKey={[fieldKey, 'name']}
                            rules={[{ required: true, message: 'name' }]}
                          >
                            <Input placeholder="name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            fieldKey={[fieldKey, 'description']}
                            rules={[{ required: true, message: 'description' }]}
                          >
                            <Input placeholder="description" />
                          </Form.Item>
                          <span onClick={() => remove(name)}>X</span>
                          <span
                            onClick={() => move(index, index - 1)}
                            style={{ cursor: 'pointer' }}
                          >
                            ↑
                          </span>
                          <span
                            onClick={() => move(index, index + 1)}
                            style={{ cursor: 'pointer' }}
                          >
                            ↓
                          </span>
                        </Space>
                      ),
                    )}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block>
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label="response">
              <Form.List name={['api', 'response']}>
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(
                      ({ key, name, fieldKey, ...restField }, index) => (
                        <Space
                          key={key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            fieldKey={[fieldKey, 'name']}
                            rules={[{ required: true, message: 'name' }]}
                          >
                            <Input placeholder="name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            fieldKey={[fieldKey, 'description']}
                            rules={[{ required: true, message: 'description' }]}
                          >
                            <Input placeholder="description" />
                          </Form.Item>
                          <span onClick={() => remove(name)}>X</span>
                          <span
                            onClick={() => move(index, index - 1)}
                            style={{ cursor: 'pointer' }}
                          >
                            ↑
                          </span>
                          <span
                            onClick={() => move(index, index + 1)}
                            style={{ cursor: 'pointer' }}
                          >
                            ↓
                          </span>
                        </Space>
                      ),
                    )}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block>
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SelectTable;
