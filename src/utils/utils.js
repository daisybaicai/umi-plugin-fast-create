import prettier from 'prettier';

export function urlTransform(url, prefix = '/api') {
  const nameStr = url.slice(prefix);
  return toHump(nameStr);
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
export function getColumns(properties) {
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
 * 转换Form.Items
 * @param {*} params 
 */
export function getFormItems(params) {
  let res = ``;
  params.forEach((item) => {
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
