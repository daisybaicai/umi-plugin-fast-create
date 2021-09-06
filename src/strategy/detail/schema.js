const schema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "http://example.com/example.json",
  "type": "object",
  "title": "The root schema",
  "description": "The root schema comprises the entire JSON document.",
  "default": {},
  "examples": [
      {
          "modelName": "login",
          "componentsName": "Login",
          "componentsPath": "/Login/List.jsx",
          "api": {
              "description": "获取当前用户信息",
              "methods": "get",
              "url": "/api/v1/app/user/current",
              "response": [
                  {
                      "name": "companyName",
                      "type": "string",
                      "description": "公司名称"
                  },
                  {
                      "name": "loginName",
                      "type": "string",
                      "description": "登录名称, 即手机号"
                  }
              ]
          }
      }
  ],
  "required": [
      "modelName",
      "componentsName",
      "componentsPath",
      "api"
  ],
  "properties": {
      "modelName": {
          "$id": "#/properties/modelName",
          "type": "string",
          "title": "The modelName schema",
          "description": "An explanation about the purpose of this instance.",
          "default": "",
          "examples": [
              "login"
          ]
      },
      "componentsName": {
          "$id": "#/properties/componentsName",
          "type": "string",
          "title": "The componentsName schema",
          "description": "An explanation about the purpose of this instance.",
          "default": "",
          "examples": [
              "Login"
          ]
      },
      "componentsPath": {
          "$id": "#/properties/componentsPath",
          "type": "string",
          "title": "The componentsPath schema",
          "description": "An explanation about the purpose of this instance.",
          "default": "",
          "examples": [
              "/Login/List.jsx"
          ]
      },
      "api": {
          "$id": "#/properties/api",
          "type": "object",
          "title": "The api schema",
          "description": "An explanation about the purpose of this instance.",
          "default": {},
          "examples": [
              {
                  "description": "获取当前用户信息",
                  "methods": "get",
                  "url": "/api/v1/app/user/current",
                  "response": [
                      {
                          "name": "companyName",
                          "type": "string",
                          "description": "公司名称"
                      },
                      {
                          "name": "loginName",
                          "type": "string",
                          "description": "登录名称, 即手机号"
                      }
                  ]
              }
          ],
          "required": [
              "description",
              "methods",
              "url",
              "response"
          ],
          "properties": {
              "description": {
                  "$id": "#/properties/api/properties/description",
                  "type": "string",
                  "title": "The description schema",
                  "description": "An explanation about the purpose of this instance.",
                  "default": "",
                  "examples": [
                      "获取当前用户信息"
                  ]
              },
              "methods": {
                  "$id": "#/properties/api/properties/methods",
                  "type": "string",
                  "title": "The methods schema",
                  "description": "An explanation about the purpose of this instance.",
                  "default": "",
                  "examples": [
                      "get"
                  ]
              },
              "url": {
                  "$id": "#/properties/api/properties/url",
                  "type": "string",
                  "title": "The url schema",
                  "description": "An explanation about the purpose of this instance.",
                  "default": "",
                  "examples": [
                      "/api/v1/app/user/current"
                  ]
              },
              "response": {
                  "$id": "#/properties/api/properties/response",
                  "type": "array",
                  "title": "The response schema",
                  "description": "An explanation about the purpose of this instance.",
                  "default": [],
                  "examples": [
                      [
                          {
                              "name": "companyName",
                              "type": "string",
                              "description": "公司名称"
                          },
                          {
                              "name": "loginName",
                              "type": "string",
                              "description": "登录名称, 即手机号"
                          }
                      ]
                  ],
                  "additionalItems": true,
                  "items": {
                      "$id": "#/properties/api/properties/response/items",
                      "anyOf": [
                          {
                              "$id": "#/properties/api/properties/response/items/anyOf/0",
                              "type": "object",
                              "title": "The first anyOf schema",
                              "description": "An explanation about the purpose of this instance.",
                              "default": {},
                              "examples": [
                                  {
                                      "name": "companyName",
                                      "type": "string",
                                      "description": "公司名称"
                                  }
                              ],
                              "required": [
                                  "name",
                                  "type",
                                  "description"
                              ],
                              "properties": {
                                  "name": {
                                      "$id": "#/properties/api/properties/response/items/anyOf/0/properties/name",
                                      "type": "string",
                                      "title": "The name schema",
                                      "description": "An explanation about the purpose of this instance.",
                                      "default": "",
                                      "examples": [
                                          "companyName"
                                      ]
                                  },
                                  "type": {
                                      "$id": "#/properties/api/properties/response/items/anyOf/0/properties/type",
                                      "type": "string",
                                      "title": "The type schema",
                                      "description": "An explanation about the purpose of this instance.",
                                      "default": "",
                                      "examples": [
                                          "string"
                                      ]
                                  },
                                  "description": {
                                      "$id": "#/properties/api/properties/response/items/anyOf/0/properties/description",
                                      "type": "string",
                                      "title": "The description schema",
                                      "description": "An explanation about the purpose of this instance.",
                                      "default": "",
                                      "examples": [
                                          "公司名称"
                                      ]
                                  }
                              },
                              "additionalProperties": true
                          }
                      ]
                  }
              }
          },
          "additionalProperties": true
      }
  },
  "additionalProperties": true
};

export default schema;