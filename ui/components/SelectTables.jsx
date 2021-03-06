import React, { useContext } from 'react';
import { Table, Button, Form, Modal, Input, Space } from 'antd';
import { getParams, getResponse, getTransformArr } from '../utils/data';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/utils';
import styles from './index.less';

function SelectTable({ api }) {
  const [form] = Form.useForm();

  // const {api} = useContext(MyContext);

  const handleShow = record => {
    if (record.children) {
      return;
    }

    setVisible(true);
    const params = getParams(record);
    const response = getResponse(record);

    // 'api', 'params'
    form.setFieldsValue({
      api: {
        description: record.description || '',
        methods: record.method,
        url: record.url,
        params,
        response,
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
      render: (_, record) => <a onClick={() => handleShow(record)}>查看</a>,
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
        const  {api: apiInfos = {}, ...rest} = values;
        let res = [];
        if(apiInfos?.response) {
          res = apiInfos?.response;
        }
        apiInfos.response = res;
        const payload = {
          ...rest,
          api: apiInfos,
        }
      await api.callRemote({
        type: 'org.plugin.template.list',
        payload: {
          text: JSON.stringify(payload),
        },
      });
      // }
    });
  };

  return (
    <>
      <Button
        onClick={() => {
          const res = getLocalStorage('swagger-data');
          alert(res);
          setInitialObjects(JSON.parse(res).paths);
        }}
      >
        填充table
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
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
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
                        <span onClick={() => remove(name)}>移除</span>
                      </Space>
                    ))}
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
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
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
                        <span onClick={() => remove(name)}>移除</span>
                      </Space>
                    ))}
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
