import prettier from 'prettier';

export function urlTransform(url, prefix = '/api/v1') {
  const nameArr = url.split(prefix);
  const nameStr = nameArr.length > 1 ? nameArr[1]: nameArr[0]
  return toHump(nameStr);
}

export function createStateName(url, suffix = 'List') {
  return url.replace(new RegExp(suffix,'i'), "") + suffix
}


/**
 * 驼峰转化
 * @param {*} name
 */
export function toHump(name) {
  return name.replace(/\/(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 格式化代码
 * @param {*} code
 */
export function prettify(code) {
  if (code) {
    return prettier.format(code, {
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 120,
      tabWidth: 2,
      parser: 'babel',
    });
  }
  return '';
}

export function getLastStr(path) {
  var urlStr = path;
  var index = urlStr.lastIndexOf('/');
  urlStr = urlStr.substring(index + 1, urlStr.length);
  return urlStr;
}

/**
 * 转化columns
 * @param {*} properties
 */
export function getColumns(properties = {}) {
  const columns = [];
  Object.keys(properties).map(key => {
    columns.push({
      title: properties[key].description,
      dataIndex: key,
    });
  });
  return JSON.stringify(columns);
}

/**
 * 转化columns
 * @param {*} properties
 */
 export function getColumnsNew(properties = []) {
  const columns = [];
  Array.isArray(properties) && properties.map(key => {
    columns.push({
      title: key?.description,
      dataIndex: key?.name,
    });
  });
  return JSON.stringify(columns);
}

/**
 * 转换Form.Items
 * @param {*} params
 */
export function getFormItems(params) {
  let res = ``;
  params.forEach(item => {
    res += `
      <Col span={6}>
        <Form.Item label="${item.description}" name="${item.name}">
          <Input placeholder="请输入" />
        </Form.Item>
      </Col>
`;
  });
  return res;
}

/**
 * 转换Form.Items
 * @param {*} params
 */
export function getFormItemsInForm(params) {
  let res = ``;
  params.forEach(item => {
    res += `
    <Form.Item
    name="${item.name}"
    label="${item.description}"
    rules={[
      {
        required: true,
        message: '请输入${item.description}',
      },
    ]}
    validateFirst
  >
    <Input placeholder="请输入${item.description}" autoComplete="off" />
  </Form.Item>
`;
  });
  return res;
}

/**
 * 处理详情info
 * @param {*} response 
 * @returns 
 */
export function getDetailInfos(response) {
  console.log('params', response);
  const res = [];
  if(Array.isArray(response)) {
    response.forEach((item) => {
      res.push({
        name: item.description,
        value: `data?.${item.name}`,
      });
    });
  }


  const cardInfo = [
    {
      title: '详情信息',
      isShow: true,
      children: res,
    }
  ];

  const text = `
    const cardInfo = ${JSON.stringify(cardInfo)}
  `;

  return text;
} 