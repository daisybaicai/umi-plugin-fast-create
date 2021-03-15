import {getColumns, prettify, getFormItemsInForm} from '../../utils/utils';

const text = ({modelName, fetchName, params, response}) => `import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Form, Input, message } from 'antd';
import { useDva } from '@/utils/hooks';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

export default function () {
  const {
    dispatch,
    loadings: { loading },
  } = useDva({ loading: '${modelName}/${fetchName}' });
  const [form] = Form.useForm();
  const onFinish = (values) => {
    dispatch({
      type: '${modelName}/${fetchName}',
      payload: values,
    })
      .then((msg) => {
        message.success(msg);
      })
      .catch((err) => {
        message.error(err);
      });
  };


  return (
    <PageHeaderWrapper breadcrumb={null} title="表单">
        <div >
          <Form
            {...formItemLayout}
            name="register"
            form={form}
            onFinish={onFinish}
          >
            ${
              getFormItemsInForm(params)
            }
            <Form.Item wrapperCol={{ span: 8, offset: 8 }} style={{ marginTop: '8px' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
    </PageHeaderWrapper>
  );
}

  
`
export default text;