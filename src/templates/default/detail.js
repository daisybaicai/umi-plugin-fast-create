import {getColumns, prettify, getFormItems} from '../../utils/utils';

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

  const cardInfo = [
    {
      title: '详情信息',
      isShow: true,
      children: [
        {
          key: '用户ID',
          value: detail.userId,
        },
        {
          key: '联系方式',
          value: detail.mobile,
        },
        {
          key: '账户创建时间',
          value: formatTimeToDateSecond(detail.gmtCreated),
        },
      ],
    }
  ];

  const res = [];
  Object.keys(properties).map((key) => {
    res.push({
      name: properties[key].description,
      value: data?.${key},
    });
  });

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