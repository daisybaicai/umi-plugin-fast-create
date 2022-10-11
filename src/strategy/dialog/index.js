import { TYPES } from '../../common/enum';
import { handleApi, handleInsertComponent, handleModel } from '../common';


const handleDialog = async (api, text, options) => {
  var jsonData = eval('(' + text + ')');

  // 类型处理
  if (typeof jsonData !== 'object') {
    return;
  }
  const absPath = api.paths.absSrcPath;

  handleApi(absPath, jsonData, options);
  // 2. 创建model
  handleModel(absPath, jsonData, TYPES.DIALOG, options);
  // 3. 创建components
  handleInsertComponent(absPath, jsonData, TYPES.DIALOG);
};

export default handleDialog;
