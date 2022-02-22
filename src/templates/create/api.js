import {sliceApiUrl, urlTransform} from '../../utils/utils'
/**
 * 生成api 配置
 * @param payload
 */
export default function(payload) {
  const { url, methods = 'GET', params, description } = payload;

  const upperMethods = methods.toUpperCase();

  const functionName = urlTransform(url);

  const hasparams = Array.isArray(params) && params.length > 0;

  const getParams = hasparams && upperMethods === 'GET';

  let requestUrl = "`${HOST}";
  requestUrl+= sliceApiUrl(url);
  if(getParams) {
    requestUrl += '?${stringify(params)}';
  }
  requestUrl+="`";

  const code = `
    \n
    // ${description}
    export async function fetch${functionName}(${hasparams ? 'params': ''}) {
      return request(${requestUrl}, {
        method: '${upperMethods}',
        ${
            (upperMethods !== 'GET' && hasparams) ? `data: params,`: ''
        }
      });
    }
  `;

  return code;
}