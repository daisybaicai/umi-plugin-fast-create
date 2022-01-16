import {getColumns, prettify, getFormItemsInForm} from '../../utils/utils';

const text = ({modelName, fetchName, params, response}) => `import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Form, Input, message } from 'antd';
import { useDva } from '@/utils/hooks';
import { QuestionCircleOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

export default function () {
  const {
    dispatch,
    loadings: { loading },
  } = useDva({ loading: '${modelName}/${fetchName}' });

  const handleDeleteRow = (id) => {
    Modal.confirm({
      title: "您确定要删除吗？",
      okText: '确定',
      cancelText: '取消',
      icon: <QuestionCircleOutlined />,
      onOk: () => {
        return dispatch({
          type: '${modelName}/${fetchName}',
          payload: {
            id,
          },
        })
          .then(() => {
            submit();
            message.success("删除成功");
          })
          .catch((msg) => {
            message.error(msg);
          });
      },
    });
  };

  return (
    <PageHeaderWrapper breadcrumb={null} title="删除">
        <div >
            <a onClick={() => handleDeleteRow(id)}>删除</a>
        </div>
    </PageHeaderWrapper>
  );
}

  
`
export default text;