import fs from 'fs';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import template from '@babel/template';
import { getStat, dirExists, writeFile, readFile } from '../utils/fs';
import { urlTransform } from '../utils/utils';

const payloadInfo = array1 =>
  array1.reduce((prev, cur) => {
    prev[cur.name] = `params.${cur.name}`;
    return prev;
  }, {});

export default async function handleActionTop(url, jsonData, options, moreOptions) {
    const text = await readFile(url);

  const {
    modelName,
    fetchName,
    clearName,
    stateName,
    params,
    response,
  } = moreOptions;

  const ast = parser.parse(text.toString(), {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let importFlag = 0;

  const templateAST = parser.parse(
    `
  <Button
  type="primary"
  onClick={() => {
    ${jsonData.handleName}({});
  }}
>
  操作
</Button>
  `,
    {
      sourceType: 'module',
      plugins: ['jsx'],
    },
  );

  const templatedNode = templateAST.program.body[0].expression;

  const templateActionCode = `
  const ${jsonData.handleName} = ({}) => {
    Modal.confirm({
      title: '确定要吗？',
      content: '关闭。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return dispatch({
          type: '${modelName}/${fetchName}',
          payload:${JSON.stringify(payloadInfo(params))},
        })
          .then(() => {
            //refresh
            message.success('成功');
          })
          .catch((msg) => {
            message.error(msg);
          });
      },
    });
  };`;

  const templateActionAST = parser.parse(templateActionCode, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // console.log('e', templateActionAST);
  const templateActionASTCode = templateActionAST.program.body[0];

  let insertFlag = 1;

  traverse(ast, {
    // path表示当前访问的路径，path.node就能取到当前访问的Node.
    ImportDeclaration(path) {
      // 保证Program添加过了以后，importDeclaration里面不会再加入
      if (importFlag) {
        return;
      }
      const { node } = path;
      // 往指定的里面加入新依赖
      if (node.source.value === '@baas/ui') {
        const names = node.specifiers.map(item => item.imported.name);
        if (!names.includes('Modal')) {
          // 加入新的依赖完成
          const newNode = t.importSpecifier(
            t.identifier('Modal'),
            t.identifier('Modal'),
          );
          node.specifiers.push(newNode);
        }
        return;
      }
    },
    JSXElement(path) {
      const { node } = path;
      // console.log('node', node);
      if (node.children) {
        const children = node.children;
        children.map(n => {
          if (
            t.isJSXElement(n) &&
            n.openingElement.name.name === 'Table' &&
            insertFlag
          ) {
            if (jsonData.position === 'tableTop') {
              node.children.unshift(templatedNode);
            }
            insertFlag = 0;
            return;
          }
        });
      }
    },
    Program(path) {
      const { node } = path;
      const nodes = node.body;
      let curName;
      nodes.map(n => {
        if (t.isExportDefaultDeclaration(n)) {
          curName = n.declaration.name;
        }
      });
      nodes.map(n => {
        if (
          t.isVariableDeclaration(n) &&
          n.declarations[0].id.name === curName
        ) {
          // 创建指定的const方法以及需要的变量
          const body = n.declarations[0].init.body;
          const newNode = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('editFormRef'),
              t.identifier('useRef()'),
            ),
          ]);
          const len = body.body.length;
          // 首位
          body.body.unshift(newNode);
          // 倒数位置
          body.body.splice(len - 2, 0, templateActionASTCode);
        }
      });
    },
  });

  return generate(ast, {}).code;
}
