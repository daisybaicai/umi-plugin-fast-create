import fs from 'fs';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import * as parser from '@babel/parser';
import generate from '@babel/generator';
import template from '@babel/template';
import { getStat, dirExists, writeFile, readFile } from '../utils/fs';
import { getFormItemsInForm, urlTransform } from '../utils/utils';


export default async function handleActionModal(
  url,
  jsonData,
  options,
  moreOptions,
) {
  const text = await readFile(url);

  const _modalParams = jsonData.modalParams;
  const _modalForm = jsonData.modalForm;
  const _operate = 'operate';

  const {
    // modelName,
    fetchName,
    // clearName,
    // stateName,
    params,
    response,
  } = moreOptions;

  const ast = parser.parse(text.toString(), {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let importFlag = 0;

  

  const templateActionCode = `  
  const ${jsonData.handleName} = () => {
    return ${_modalForm}.validateFields().then((values) => {
      submitForm(payload).then(res => {
        if(res && res.code === 0) {
          setData(res.data);
          message.success(res.msg);
        } else {
          message.error(res?.msg);
        }
      })
    })
  };`;

  const FormModalCode = `
  <Modal
  width="566px"
  {...${_modalParams}.modalProps}
  open={${_modalParams}.visible}
  title="弹框"
  onOk={${jsonData.handleName}}
  bodyStyle={{
    maxHeight: '600px',
    overflow: 'auto',
  }}>
  <Form form={${_modalForm}}>
  ${getFormItemsInForm(params, jsonData.loadItem)}
  </Form>
</Modal>
  `;

  const formAst = parser.parse(FormModalCode, {
    sourceType: 'module',
    plugins: ['jsx'],
  });


  const templateActionAST = parser.parse(templateActionCode, {
    sourceType: 'module',
    plugins: ['jsx'],
  });



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
      if (node.source.value === '@/services/api') {
        // 加入新的依赖 ！ 完成
        const newNode = t.importSpecifier(
          t.identifier(fetchName),
          t.identifier(fetchName),
        );
        node.specifiers.push(newNode);
        return;
      }
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
    Program(path) {
      const { node } = path;
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
          const newOperateParam = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(`[${_operate}]`),
              t.identifier('useState(true)'),
            ),
          ]);

          const newFormParam = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(`{run: submitForm}`),
              t.identifier(`useRequest(${fetchName}, { manual: true })`),
            ),
          ]);

          const newNodeParam = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(_modalParams),
              t.identifier('useModalParams()'),
            ),
          ]);
          const newNodeForm = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(`[${_modalForm}]`),
              t.identifier('Form.useForm()'),
            ),
          ]);
          const len = body.body.length;
          // 首位
          body.body.unshift(newOperateParam);
          body.body.unshift(newFormParam);
          body.body.unshift(newNodeParam);
          body.body.unshift(newNodeForm);

          // 倒数位置
          body.body.splice(len - 2, 0, templateActionASTCode);

          const lastReturn = body.body[body.body.length - 1];
          lastReturn.argument.children.push(formAstCode);
        }
      });
    },
  });

  return generate(ast, {}).code;
}
