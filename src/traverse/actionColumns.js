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

export default async function handleActionColumns(
  url,
  jsonData,
  options,
  moreOptions,
) {
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
    `const node = {
      title: '操作',
      render: (_, record) => {
        return (
          <a
          onClick={() => {
            ${jsonData.handleName}(record);
          }}
        >
          操作
        </a>
        )
      }
    }
  `,
    {
      sourceType: 'module',
      plugins: ['jsx'],
    },
  );

  const templatedNode = templateAST.program.body[0].declarations[0].init;

  const templateActionCode = `
  const ${jsonData.handleName} = (record) => {
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
            message.success('成功');
            // run(...p);
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
      if (node.source.value === 'antd') {
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
    VariableDeclarator(path) {
      const { node } = path;
      if (node.id && node.id.name === 'columns') {
        node.init.elements.push(templatedNode);
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
          const len = body.body.length;
          // 倒数位置
          body.body.splice(len - 2, 0, templateActionASTCode);
        }
      });
    },
  });

  return generate(ast, {}).code;
}
