import { TYPES } from '../../common/enum';
import { handleApi, handleComponents, handleModel } from '../common';

const handleList =  async (api, text) => {
  var jsonData = eval('(' + text + ')');

  // 类型处理
  if (typeof jsonData !== 'object') {
    return;
  }

  const absPath = api.paths.absSrcPath;

  handleApi(absPath, jsonData)
  // 2. 创建model
  handleModel(absPath, jsonData, TYPES.LIST)
  // 3. 创建components
  handleComponents(absPath, jsonData, TYPES.LIST)
};

export default handleList;