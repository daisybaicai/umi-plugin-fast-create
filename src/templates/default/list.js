import { getColumnsNew, getFormItems, prettify } from '../../utils/utils';

const text = ({modelName, fetchName, clearName, stateName, params, response}) => `import React, { useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, Card, message, Space } from 'antd';
import { useSearchFormTable } from '@/utils/hooks';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { ${fetchName} } from '@/services/api';

const { Option } = Select;
const List = () => {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);

  const { run: getList } = useRequest(${fetchName}, { manual: true });
  const getTableData = ({ current, pageSize }, formData) => {
    const payload = {
      pageNum: current,
      pageSize,
      ...formData,
    };
    return getList(payload);
  };

  const { tableProps, search } = useSearchFormTable(getTableData, {
    form,
    total: list.total,
    dataSource: list.items,
    format: true,
    manual: false,
    onError: (err) => {
      message.error(err);
    },
    onSuccess: (res) => {
      if(res && res.code === 0) {
        setList(res.data)
        return;
      }
      setList([]);
    },
    defaultParams: [
      {
        current: 1,
        pageSize: 10,
      },
    ],
  });

  const { submit, reset } = search;


  const columns = ${
    prettify(getColumnsNew(response))
  }

  const searchForm = (
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <Form form={form} name="search">
        <Row gutter={24}>
          ${
            getFormItems(params)
          }
        </Row>
        <Row gutter={24}>
          <Col style={{ textAlign: 'right' }} md={24} lg={24} xs={24}>
            <div>
              <Button type="primary" htmlType="submit" onClick={submit}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={reset}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
  return (
    <PageContainer title="列表" breadcrumb={null}>
      <Card bordered={false} style={{ marginBottom: 20 }}>
        {searchForm}
      </Card>
      <Card bordered={false}>
        <Table
          scroll={{
            x: 'calc(100% - 100px)',
          }}
          columns={columns}
          {...tableProps}
          rowKey={record => record.id}
        />
      </Card>
    </PageContainer>
  );
};

export default List;
  
`
export default text;