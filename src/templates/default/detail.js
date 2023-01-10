import { getColumns, prettify, getDetailInfos, getDetailParams } from '../../utils/utils';

const text = ({modelName, fetchName, clearName, stateName, params, response}) => `import React from 'react';
import { Button, Col, Form, Row, Card, message, Descriptions  } from 'antd';
import { useMount, useRequest} from 'ahooks';
import { PageContainer } from '@ant-design/pro-layout';
import { ${fetchName} } from '@/services/api';


const Detail = (props) => {
  const {
    match: { params },
  } = props;

  const { run: getDetail } = useRequest(${fetchName}, { manual: true });
  const [data, setData] = useState({});

  useMount(() => {
    getDetail({
      ${getDetailParams(params)}
    }
    ).then(res => {
      if(res && res.code === 0) {
        setData(res.data)
      }
    })
  });


  ${
    getDetailInfos(response, 'data')
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