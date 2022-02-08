import fs from 'fs';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import template from "@babel/template";
import { getStat, dirExists, writeFile, readFile } from '../utils/fs';
import {urlTransform} from '../utils/utils';

export async function  handleBabelTraverse(url, jsonData, options) {
  // 读取文件
  const text = await readFile(url);

  const ast = parser.parse(text.toString(), {
    sourceType: 'module',
    plugins: ['js'],
  });

  let importFlag = 0;

  const fetchName = `fetch` + urlTransform(jsonData.api.url);


  // 替换模板内容然后获取指定内容块
  const templateText = `
  const vtm_model = {
    effects: {
      *${fetchName}({ payload }, { call }) {
        const response = yield call(${fetchName}, payload);
        if (response && response.code === ${options.code}) {
          return Promise.resolve();
        }
        return Promise.reject(response.message || '请求失败');
      }
    }
  }
  `
  const templateAST = parser.parse(templateText.toString(), {
    sourceType: 'module',
    plugins: ['js'],
  });



  const TMPAST = {
    effectsDetail: {},
  }

  traverse(templateAST, {
    ObjectExpression(path) {
      const properties = path.node.properties;
      properties.forEach(pNode => {
        if (
          t.isIdentifier(pNode.key, {
            name: 'effects',
          })
        ) {
          const node = pNode.value.properties[0];
          TMPAST.effectsDetail = node;
        }
      });
    }
  })


  traverse(ast, {
    // path表示当前访问的路径，path.node就能取到当前访问的Node.
    ImportDeclaration(path) {
      // 保证Program添加过了以后，importDeclartion里面不会再加入
      if (importFlag) {
        return;
      }
      const { node } = path;
      // 往指定的里面加入新依赖
      if (node.source.value === '@/services/api') {
        // 加入新的依赖 ！ 完成
        const newNode = t.importSpecifier(
          t.identifier(fetchName),
          t.identifier(fetchName),
        );
        node.specifiers.push(newNode);
        return;
      }
    },
    Program(path) {
      const nodeLists = path.node.body;
      // 遍历看有没有，如果没有就加入默认的
      const flag = nodeLists.some(item => {
        return (
          t.isImportDeclaration(item) && item.source.value === '@/services/api'
        );
      });
      if (!flag) {
        const importNode = t.importDeclaration(
          [
            t.importSpecifier(
              t.identifier(fetchName),
              t.identifier(fetchName),
            ),
          ],
          t.stringLiteral('@/services/api'),
        );
        importFlag = 1;
        path.node.body.unshift(importNode);
      }
    },
    ObjectExpression(path) {
      const properties = path.node.properties;
      properties.forEach(pNode => {

        if (
          t.isIdentifier(pNode.key, {
            name: 'effects',
          })
        ) {
          const fetchCode = TMPAST.effectsDetail;
          pNode.value.properties.push(fetchCode)
        }
      });
    },
  });


  return generate(ast, {}).code;
}
