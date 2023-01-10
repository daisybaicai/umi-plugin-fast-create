import {getColumns, prettify, getFormItemsInForm} from '../../utils/utils';

const text = ({modelName, fetchName, params, response, loadItem = false}) => `import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Input, message } from 'antd';
import { useRequest } from 'ahooks';
import { getNormalRules } from '@/common/project';
import loadApplyItem from '@/ApplyItem/loadApplyItem';
import { ${fetchName} } from '@/services/api';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

export default function () {
  const [form] = Form.useForm();
  const [operate] = useState(true);

  const { run: submitForm, loading } = useRequest(${fetchName}, { manual: true });

  const onFinish = (values) => {
    submitForm(payload).then(res => {
      if(res && res.code === 0) {
        setData(res.data);
        message.success(res.msg);
      } else {
        message.error(res?.msg);
      }
    })
  };


  return (
    <PageContainer breadcrumb={null} title="表单">
        <div >
          <Form
            {...formItemLayout}
            name="register"
            form={form}
            onFinish={onFinish}
          >
            ${
              getFormItemsInForm(params, loadItem)
            }
            <Form.Item wrapperCol={{ span: 8, offset: 8 }} style={{ marginTop: '8px' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
    </PageContainer>
  );
}

  
`
export default text;