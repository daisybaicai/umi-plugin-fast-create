import { getLocalStorage } from '../utils/utils';

export const getTransformArr = obj => {
  const tags = new Set();
  const data = [];
  Object.keys(obj).forEach(path => {
    const pathObj = obj[path];
    const methods = Object.keys(pathObj);
    methods.forEach(method => {
      const methodsObject = pathObj[method];
      data.push({
        url: path,
        method,
        description: methodsObject.summary || '',
        tags: methodsObject.tags.join(''),
        id: methodsObject.operationId,
      });
      tags.add(methodsObject.tags.join(''));
    });
  });
  // const

  const tagsArr = [...tags].map((tag, index) => {
    const tagArr = data.filter(item => item.tags === tag);
    return {
      tags: tag,
      key: index,
      children: tagArr,
    };
  });

  // console.log('arr', tagsArr);

  return tagsArr;
};

export const getSwaggerInfos = () => {
  const swaggerData = getLocalStorage('swagger-data');
  const parsed = JSON.parse(swaggerData) || {};
  return parsed;
};

export const getCurrentPathInfo = (record = {}, paths = []) => {
  const { method = '', url = '' } = record;
  const currentPath = paths[url][method]
  return currentPath || {};
};

export const transformParams = (parameters = [], definitions) => {
  const result =
    Array.isArray(parameters) &&
    parameters.map(item => {
      if (item.schema) {
        const schemaNameRef = item.schema['$ref'];
        const schemaName = schemaNameRef.substring(
          schemaNameRef.lastIndexOf('/') + 1,
        );
        const curSchema = definitions[schemaName];

        const properties = Object.keys(curSchema?.properties).map(key => {
          const curProperties = curSchema.properties[key];
          return {
            name: key,
            ...curProperties,
          };
        });
        return properties;
      }
      return item.schema;
    });
  return result[0];
};

export const getParams = record => {
  // 获取数据源
  const { paths = {}, definitions = {} } = getSwaggerInfos();
  const { parameters = [] } = getCurrentPathInfo(record, paths);
  // debugger
  const transFormedParams = transformParams(parameters, definitions);
  return transFormedParams;
};

export const getResponse = record => {
  // 获取数据源
  const { paths = {}, definitions = {} } = getSwaggerInfos();
  // debugger
  const { responses = [] } = getCurrentPathInfo(record, paths);
  // debugger
  const transFormedParams = transformResponse(responses["200"], definitions);
  // alert(JSON.stringify(transFormedParams))
  return transFormedParams;
};

const flat = arr => {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, []);
};

export const getSchema = (schema, definitions) => {
  if (schema) {
    const schemaNameRef = schema['$ref'] || '';
    const schemaName = schemaNameRef.substring(
      schemaNameRef.lastIndexOf('/') + 1,
    );
    const curSchema = schemaName ? definitions[schemaName] : {};

    const properties = Object.keys(curSchema?.properties || {}).map(key => {
      const curProperties = curSchema.properties[key];
      if(curProperties?.items?.originalRef) {
        const res = getSchema(curProperties?.items, definitions);
        return res;
      }
      return {
        name: key,
        ...curProperties,
      };
    }) || [];
    return flat(properties);
  }
  return [];
}

export const transformResponse = (obj, definitions) => {
  const schema = obj?.schema || {};
  if (schema) {
    const schemaNameRef = schema['$ref'];
    const schemaName = schemaNameRef.substring(
      schemaNameRef.lastIndexOf('/') + 1,
    );
    const curSchema = definitions[schemaName];

    const dataProperties = curSchema?.properties["data"];

    const res = getSchema(dataProperties, definitions);
    return res;
  }
  return [];
};
