import { getColumns, prettify, getDetailInfos } from '../../utils/utils';

const text = ({modelName, fetchName, clearName, stateName, params, response}) => `import React from 'react';
import { Button, Col, Form, Input, Row, Select, Card, message } from 'antd';
import { useDva } from '@/utils/hooks';
import { useMount, useUnmount } from '@umijs/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import InfoContent from '@/components/InfoContent';


const { Option } = Select;
const Detail = () => {
  const {
    dispatch,
    data: {
      ${modelName}: { ${stateName} = {} },
    },
  } = useDva({ loading: '${modelName}/${fetchName}' }, ['${modelName}']);


  useMount(() => {
    dispatch({
      type: '${modelName}/${fetchName}',
      // TODO: 需要自行补充
      payload: {
      },
    }).catch((err) => {
      message.error(err);
    });
  });


  useUnmount(() => {
    dispatch({
      type: '${modelName}/${clearName}',
    });
  });

  ${
    getDetailInfos(response)
  }

  return (
    <PageHeaderWrapper breadcrumb={null} title="详情">
      <Card bordered={false}>
        <InfoContent data={cardInfo} />
      </Card>
    </PageHeaderWrapper>
  );
};

export default Detail;
  
`
export default text;