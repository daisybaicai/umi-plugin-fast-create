import { getColumnsNew, getFormItems, prettify } from '../../utils/utils';

const text = ({modelName, fetchName, clearName, stateName, params, response}) => `import React, { useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, Card, message, Space } from 'antd';
import { useDva, useSearchFormTable, useModalParams } from '@/utils/hooks';
import { useMount, useUnmount } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { getNormalRules } from '@/common/project';
import loadApplyItem from '@/ApplyItem/loadApplyItem';

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
      type: '${modelName}/clearList',
      key: '${stateName}'
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
        />
      </Card>
    </PageContainer>
  );
};

export default List;
  
`
export default text;