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
                "description": "登录接口",
                "methods": "post",
                "url": "/bms-api/sys/login",
                "params": [
                    {
                        "name": "32",
                        "description": "23"
                    }
                ],
                "response": []
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
                    "description": "登录接口",
                    "methods": "post",
                    "url": "/bms-api/sys/login",
                    "params": [
                        {
                            "name": "32",
                            "description": "23"
                        }
                    ],
                    "response": []
                }
            ],
            "required": [
                "description",
                "methods",
                "url",
                "params",
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
                        "登录接口"
                    ]
                },
                "methods": {
                    "$id": "#/properties/api/properties/methods",
                    "type": "string",
                    "title": "The methods schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "post"
                    ]
                },
                "url": {
                    "$id": "#/properties/api/properties/url",
                    "type": "string",
                    "title": "The url schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "/bms-api/sys/login"
                    ]
                },
                "params": {
                    "$id": "#/properties/api/properties/params",
                    "type": "array",
                    "title": "The params schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": [],
                    "examples": [
                        [
                            {
                                "name": "32",
                                "description": "23"
                            }
                        ]
                    ],
                    "additionalItems": true,
                    "items": {
                        "$id": "#/properties/api/properties/params/items",
                        "anyOf": [
                            {
                                "$id": "#/properties/api/properties/params/items/anyOf/0",
                                "type": "object",
                                "title": "The first anyOf schema",
                                "description": "An explanation about the purpose of this instance.",
                                "default": {},
                                "examples": [
                                    {
                                        "name": "32",
                                        "description": "23"
                                    }
                                ],
                                "required": [
                                    "name",
                                    "description"
                                ],
                                "properties": {
                                    "name": {
                                        "$id": "#/properties/api/properties/params/items/anyOf/0/properties/name",
                                        "type": "string",
                                        "title": "The name schema",
                                        "description": "An explanation about the purpose of this instance.",
                                        "default": "",
                                        "examples": [
                                            "32"
                                        ]
                                    },
                                    "description": {
                                        "$id": "#/properties/api/properties/params/items/anyOf/0/properties/description",
                                        "type": "string",
                                        "title": "The description schema",
                                        "description": "An explanation about the purpose of this instance.",
                                        "default": "",
                                        "examples": [
                                            "23"
                                        ]
                                    }
                                },
                                "additionalProperties": true
                            }
                        ]
                    }
                },
                "response": {
                    "$id": "#/properties/api/properties/response",
                    "type": "array",
                    "title": "The response schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": [],
                    "examples": [
                        []
                    ],
                    "additionalItems": true,
                    "items": {
                        "$id": "#/properties/api/properties/response/items"
                    }
                }
            },
            "additionalProperties": true
        }
    },
    "additionalProperties": true
};

export default schema;