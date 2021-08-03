var Validator = require('jsonschema').Validator;
import schema from './schema';
import { getStat, dirExists, writeFile, readFile } from '../../utils/fs';
import {getLastStr, prettify, urlTransform} from '../../utils/utils';
import defaultApiTemplate  from '../../templates/default/api';
import defaultApiModel  from '../../templates/default/model';
import defaultListTempalte  from '../../templates/default/list';

import createApi from '../../templates/create/api';
import { handleBabelTravese } from '../../traverse';


/**
 * handleApi
 * @param {*} absoultPath 
 * @param {*} jsonData 
 */
async function handleApi(absoultPath, jsonData) {
  const PrefixPath = absoultPath + '/services/';
  const fileName = 'api.js';

  // 1. 创建service
  const isExist = await getStat(PrefixPath + fileName);
  if(!isExist) {
    // 新建路径
    const stats = await dirExists(PrefixPath);
    // 创建文件，加入默认模板
    const file = await writeFile(PrefixPath + fileName, defaultApiTemplate)
  }

  const templateContent = await readFile(PrefixPath + fileName);

  const createApiText = createApi(jsonData.api);
  // 拼接
  await writeFile(PrefixPath + fileName, prettify(`${templateContent} ${createApiText}`))
}

/**
 * handleModel
 * @param {*} absoultPath 
 * @param {*} jsonData 
 */
async function handleModel(absoultPath, jsonData) {
  const PrefixPath = absoultPath + '/models/';
  const modelName = jsonData.modelName;
  const fileName = `${modelName}.js`;

  // 1. 创建service
  const isExist = await getStat(PrefixPath + fileName);
  if(!isExist) {
    // 新建路径
    const stats = await dirExists(PrefixPath);
    // 创建文件，加入默认模板
    const file = await writeFile(PrefixPath + fileName, defaultApiModel(jsonData.modelName))
  }
  const newCode = await handleBabelTravese(PrefixPath + fileName, jsonData);

  // 拼接
  await writeFile(PrefixPath + fileName, prettify(newCode))
}


/**
 * handleComponents
 * @param {*} absoultPath 
 * @param {*} jsonData 
 */
async function handleComponents(absoultPath, jsonData) {
  const PrefixPath = absoultPath + '/pages' + jsonData.componentsPath;
  const fileName = 'index.js';

  // 1. 创建service
  const isExist = await getStat(PrefixPath + fileName);
  if(!isExist) {
    // 新建路径
    const stats = await dirExists(PrefixPath);
    // // 创建文件，加入默认模板
    // const file = await writeFile(PrefixPath + fileName, defaultApiTemplate)
  }

  const {modelName, api} = jsonData;

  const fetchName = `fetch` + urlTransform(jsonData.api.url);
  const saveName = `save` + urlTransform(jsonData.api.url);
  const clearName = `clear` + urlTransform(jsonData.api.url);
  const stateName =  urlTransform(jsonData.api.url) + 'list';

  const payload = {
    modelName, fetchName, clearName, stateName, params: api.params, response: api.response
  }

  // 拼接
  await writeFile(PrefixPath + fileName, defaultListTempalte(payload))
}

const handleList =  async (api, text) => {
  var jsonData = eval('(' + text + ')');

  // 类型处理
  if (typeof jsonData !== 'object') {
    return;
  }
  // 校验数据的合理性
  var v = new Validator();
  const r = v.validate(jsonData, schema);
  console.log('e',jsonData);
  console.log('r', r);

    const absoultPath = api.paths.absSrcPath;

  if (r.valid) {
    // 1. 创建api
    handleApi(absoultPath, jsonData)
    // 2. 创建model
    handleModel(absoultPath, jsonData)
    // 3. 创建components
    handleComponents(absoultPath, jsonData)

  } else {
    console.log('不符合');
  }
};

export default handleList;

/**
 * 
 * // https://www.jsonschema.net/home 生成Schema
{
  modelName: "login",
   api: {
     url: "/api/v1/login",
     methods: "GET",
     params: [],
     description: "登录",
     response: {}
   },
  componentsName: "login",
  componentsPath: "/Login/List/index.js",
}
 */
