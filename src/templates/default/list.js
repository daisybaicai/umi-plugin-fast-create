import {getColumns, prettify, getFormItems} from '../../utils/utils';

const text = ({modelName, fetchName, clearName, stateName, params, response}) => `import React from 'react';
import { Button, Col, Form, Input, Row, Table, Select, Card, message } from 'antd';
import { useDva, useSearchFormTable } from '@/utils/hooks';
import { useMount, useUnmount } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


const { Option } = Select;
const List = () => {
  const {
    dispatch,
    data: {
      ${modelName}: { ${stateName} = {} },
    },
  } = useDva({ loading: '${modelName}/${fetchName}' }, ['${modelName}']);

  const [form] = Form.useForm();

  const getTableData = ({ current, pageSize }, formData) => {
    const payload = {
      pageNum: current,
      pageSize,
      ...formData,
    };
    return dispatch({
      type: '${modelName}/${fetchName}',
      payload,
    });
  };

  useUnmount(() => {
    dispatch({
      type: '${modelName}/${clearName}',
    });
  });

  const { tableProps, search } = useSearchFormTable(getTableData, {
    form,
    total: ${stateName}.total,
    dataSource: ${stateName}.items,
    format: true,
    manual: false,
    onError: (err) => {
      message.error(err);
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
    prettify(getColumns(response.properties))
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
    <PageHeaderWrapper breadcrumb={null} title="列表">
      <Card bordered={false}>
        {searchForm}
        <Table
          scroll={{
            x: 'calc(100% - 100px)',
          }}
          columns={columns}
          {...tableProps}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default List;
  
`
export default text;