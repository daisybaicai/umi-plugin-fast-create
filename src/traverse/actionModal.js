import fs from 'fs';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import template from '@babel/template';
import { getStat, dirExists, writeFile, readFile } from '../utils/fs';
import { getFormItemsInForm, urlTransform } from '../utils/utils';

const payloadInfo = array1 =>
  array1.reduce((prev, cur) => {
    prev[cur.name] = `params.${cur.name}`;
    return prev;
  }, {});

export default async function handleActionModal(
  url,
  jsonData,
  options,
  moreOptions,
) {
  const text = await readFile(url);

  const isCreate = jsonData.dialogFormRef === 'createFormRef';
  const formRef = jsonData.dialogFormRef;
  const handleText = isCreate ? '创建' : '编辑';

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

  const isCreateText = `${formRef}?.current?.showModal();`
  const isEditText = `
      ${formRef}?.current.showModal();
      ${formRef}?.current?.formEle.setFieldsValue({
        ...record,
      });
  `

  const temCode = `
  <Button
  type="primary"
  onClick={(record) => {
    ${isCreate ? isCreateText: isEditText}
  }}
>
  ${handleText}
</Button>
  `;


  const templateAST = parser.parse((temCode),
    {
      sourceType: 'module',
      plugins: ['jsx'],
    },
  );

  const templatedNode = templateAST.program.body[0].expression;

  const templateActionCode = `
  const ${jsonData.handleName} = ({}) => {
    return dispatch({
      type: '${modelName}/${fetchName}',
      payload: {
        // id: curItem?.id,
        ...values,
      },
    })
      .then(() => {
        ${formRef}.current.hideModal();
        message.success('${handleText}成功');
        // run(...p);
      })
      .catch((msg) => {
        message.error(msg);
      });
  };`;

  const FormModalCode = `
  <MyFormModal ref={${formRef}} title="${handleText}" handleSubmit={${jsonData.handleName}}>
  ${
    getFormItemsInForm(params)
  }
</MyFormModal>
  `
  

  const formAst = parser.parse(FormModalCode, {
    sourceType: 'module',
    plugins: ['jsx'],
  });


  const templateActionAST = parser.parse(templateActionCode, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  // console.log('e', templateActionAST);
  const templateActionASTCode = templateActionAST.program.body[0];
  const formAstCode = formAst.program.body[0];

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
            if (jsonData.position === 'modal') {
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
              t.identifier(formRef),
              t.identifier('useRef()'),
            ),
          ]);
          const len = body.body.length;
          // 首位
          body.body.unshift(newNode);
          // 倒数位置
          body.body.splice(len - 2, 0, templateActionASTCode);

          const lastReturn = body.body[body.body.length-1];
          lastReturn.argument.children.push(formAstCode);
        }
      });
    },
  });

  return generate(ast, {}).code;
}
