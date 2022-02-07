import { TYPES } from '../../common/enum';
import createApi from '../../templates/create/api';
import defaultApiTemplate from '../../templates/default/api';
import defaultListTemplate from '../../templates/default/list';
import defaultDetailTemplate from '../../templates/default/detail';
import defaultApiModel from '../../templates/default/model';
import traverseTemplates from '../../traverse/index';
import { dirExists, getStat, readFile, writeFile } from '../../utils/fs';
import { createStateName, prettify, urlTransform } from '../../utils/utils';

const strategyEnum = {
  [TYPES.LIST]: traverseTemplates.traverseList,
  [TYPES.DETAIL]: traverseTemplates.traverseDetail,
}

const templatesEnum = {
  [TYPES.LIST]: defaultListTemplate,
  [TYPES.DETAIL]: defaultDetailTemplate,
}

/**
 * handleApi
 * @param {*} absPath 
 * @param {*} jsonData 
 */
export async function handleApi(absPath, jsonData) {
  const PrefixPath = absPath + '/services/';
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
 * @param {*} absPath 
 * @param {*} jsonData 
 * @param {*} type
 */
export async function handleModel(absPath, jsonData, type) {
  const PrefixPath = absPath + '/models/';
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

  const handleBabelTraverseFunc = strategyEnum[type];
  const newCode = await handleBabelTraverseFunc(PrefixPath + fileName, jsonData);

  // 拼接
  await writeFile(PrefixPath + fileName, prettify(newCode))
}

/**
 * handleComponents
 * @param {*} absPath 
 * @param {*} jsonData 
 * @param {*} type
 */
export async function handleComponents(absPath, jsonData, type) {
  const PrefixPath = absPath + '/pages' + jsonData.componentsPath;
  const str = PrefixPath;
  var index = str.lastIndexOf("\/");  
 
const fileName  = str.substring(index + 1, str.length);
  // const fileName = PrefixPath.;

  // 1. 创建service
  const isExist = await getStat(PrefixPath + fileName);
  if(!isExist) {
    // 新建路径
    const stats = await dirExists(PrefixPath.slice(0, index));
    // // 创建文件，加入默认模板
    // const file = await writeFile(PrefixPath + fileName, defaultApiTemplate)
  }

  const {modelName, api} = jsonData;

  const fetchName = `fetch` + urlTransform(jsonData.api.url);
  const saveName = `save` + urlTransform(jsonData.api.url);
  const clearName = `clear` + urlTransform(jsonData.api.url);
  const stateName =  createStateName(urlTransform(jsonData.api.url), type);

  const payload = {
    modelName, fetchName, clearName, stateName, params: api.params, response: api.response
  }

  const defaultTemplate = templatesEnum[type];

  // 拼接
  await writeFile(PrefixPath, defaultTemplate(payload))
}