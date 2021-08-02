import React from 'react';
import { Card, Descriptions } from 'antd';

const InfoContent = `(props) => {
  const { data: dataInfo = [] } = props;

  function renderCardInfo(data) {
    return data.map((item) => {
      return item.isShow ? (
        <Card
          key={item.title}
          bordered={false}
          style={{ margin: '0 22px', borderBottom: '1px solid #f0f0f0' }}
          bodyStyle={{ padding: '22px 0' }}
        >
          <Descriptions title={item.title} column={3}>
            {item.children.length > 0
              ? item.children.map((text) => {
                  return !text.hidden ? (
                    <Descriptions.Item label={text.key} key={text.key} span={text.span || 1}>
                      {text.value}
                    </Descriptions.Item>
                  ) : null;
                })
              : null}
          </Descriptions>
        </Card>
      ) : null;
    });
  }

  return (
    <Card bodyStyle={{ padding: 0 }} bordered={false}>
      {renderCardInfo(dataInfo)}
    </Card>
  );
}`;

export default InfoContent;
