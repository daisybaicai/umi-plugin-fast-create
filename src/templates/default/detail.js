import { getColumns, prettify, getDetailInfos } from '../../utils/utils';

const payloadInfo = (array1) => array1.reduce((prev, cur) => {
	prev[cur.name] = `params.${cur.name}`;
  	return prev;
}, {})

const text = ({modelName, fetchName, clearName, stateName, params, response}) => `import React from 'react';
import { Button, Col, Form, Input, Row, Select, Card, message } from 'antd';
import { useDva } from '@/utils/hooks';
import { useMount, useUnmount } from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';


const { Option } = Select;
const Detail = (props) => {
  const {
    dispatch,
    data: {
      ${modelName}: { ${stateName} = {} },
    },
  } = useDva({ loading: '${modelName}/${fetchName}' }, ['${modelName}']);

  const {
    match: { params },
  } = props;

  useMount(() => {
    dispatch({
      type: '${modelName}/${fetchName}',
      payload: ${JSON.stringify(payloadInfo(params))}
    }).catch((err) => {
      message.error(err);
    });
  });


  useUnmount(() => {
    dispatch({
      type: '${modelName}/clear',
      key: '${stateName}'
    });
  });

  ${
    getDetailInfos(response, stateName)
  }

  return (
    <PageContainer breadcrumb={null} title="详情">
      <Card bordered={false}>
      <Descriptions title="User Info">
        {
          cardInfo?.map(item => (
            <Descriptions.Item label={item.name} key={item.name}>{item.value}</Descriptions.Item>
          ))
        }
      </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default Detail;
  
`
export default text;