const text = (modelName) => `const ${modelName}Model = {
    namespace: '${modelName}',
    state: {},
    effects: {
    },
    reducers: {},
  };
  export default ${modelName}Model;
  
`
export default text;