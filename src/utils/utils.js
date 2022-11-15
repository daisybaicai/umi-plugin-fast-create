import prettier from 'prettier';
import { FORM_TYPES } from '../common/enum';

const titleLower = str => {
  const newStr = str.slice(0, 1).toLowerCase() + str.slice(1);
  return newStr;
};

export function urlTransform(url, prefix = '/api') {
  // const nameArr = url.split(prefix);
  // const nameStr = nameArr.length > 1 ? nameArr[1]: nameArr[0];

  let nameStr = '';
  // 处理前缀
  if (Array.isArray(prefix)) {
    prefix.forEach(pKey => {
      nameStr = url.replace(new RegExp(pKey, 'i'), '');
    });
  } else {
    nameStr = url.replace(new RegExp(prefix, 'i'), '');
  }

  const urlSlice = nameStr.replace(/\/$/, '').replace(/\/\:\w+$/, '');

  // 去除最后可能是{id}形式的文字
  const resultSlice = urlSlice.replace(/{(\w+)}/, '');
  // 去除最后可能是/结尾
  const resultEnd = resultSlice.replace(/\/$/, '');
  return toHump(resultEnd);
}

export function sliceApiUrl(url, prefix = '/api') {
  let result = '';
  // 处理前缀
  if (Array.isArray(prefix)) {
    prefix.forEach(pKey => {
      result = url.replace(new RegExp(pKey, 'i'), '');
    });
  } else {
    result = url.replace(new RegExp(prefix, 'i'), '');
  }

  // 处理最后可能是{id}形式的文字
  const result2 = result.replace(/{(\w+)}/, (_, r) => {
    return `\${params?.${r}}`;
  });
  return result2;
}

export function createStateName(url, suffix = 'List') {
  return titleLower(url.replace(new RegExp(suffix, 'i'), '') + suffix);
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
  Array.isArray(properties) &&
    properties.map(key => {
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

const renderTypes = item => {
  if (item.formType === FORM_TYPES.SELECT.code) {
    return `
      <Select placeholder="请选择" style={{ width: '100%' }} >
        {Object.keys(SELECT_ENUM).map(key => (
          <Select.Option key={key} value={SELECT_ENUM?.[key]?.code}>
            {SELECT_ENUM?.[key]?.code}
          </Select.Option>
        ))}
      </Select>
      `;
  }
  if (item.formType === FORM_TYPES.RADIO.code) {
    return `
      <Radio.Group options={
        Object.keys(RADIO_ENUM).map(item => ({
          label: RADIO_ENUM[item].desc,
          value: String(RADIO_ENUM[item].code)
        }))
      } />
      `;
  }

  if (item.formType === FORM_TYPES.DATE.code) {
    return `
      <CustomDatePicker type="DATE" />
      `;
  }

  if (item.formType === FORM_TYPES.FILE.code) {
    return `
        <FileUpload />
      `;
  }
  return `<Input placeholder="请输入" autoComplete="off"/>`;
};

/**
 * 转换Form.Items
 * @param {*} params
 */
export function getFormItemsInForm(params) {
  let res = ``;
  params.forEach(item => {
    let isSelect =
      item.formType !== FORM_TYPES.INPUT.code ? ', select: true' : '';

    res += `
    <Form.Item
    name="${item.name}"
    label="${item.description}"
    rules={getNormalRules('${
      item.description
    }', { maxLen: 20, required: true ${isSelect} })}
    validateFirst
  >
    ${renderTypes(item)}
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
  const res = [];
  if (Array.isArray(response)) {
    response.forEach(item => {
      res.push({
        name: item.description,
        value: `data?.${item.name}`,
      });
    });
  }

  const cardInfo = [
    {
      title: '详情信息',
      children: res,
    },
  ];

  const text = `
    const cardInfo = ${JSON.stringify(cardInfo)}
  `;

  return text;
}
