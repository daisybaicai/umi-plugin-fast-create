export default {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "examples": [
        {
            "modelName": "login",
            "api": {
                "url": "/api/v1/login",
                "methods": "GET",
                "params": [],
                "description": "登录",
                "response": []
            },
            "componentsName": "login",
            "componentsPath": "/Login/List/index.js"
        }
    ],
    "required": [],
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
        "api": {
            "$id": "#/properties/api",
            "type": "object",
            "title": "The api schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "url": "/api/v1/login",
                    "methods": "GET",
                    "params": [],
                    "description": "登录",
                    "response": []
                }
            ],
            "required": [],
            "properties": {
                "url": {
                    "$id": "#/properties/api/properties/url",
                    "type": "string",
                    "title": "The url schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "/api/v1/login"
                    ]
                },
                "methods": {
                    "$id": "#/properties/api/properties/methods",
                    "type": "string",
                    "title": "The methods schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "GET"
                    ]
                },
                "params": {
                    "$id": "#/properties/api/properties/params",
                    "type": "array",
                    "title": "The params schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": [],
                    "examples": [
                        []
                    ],
                    "additionalItems": true,
                    "items": {
                        "$id": "#/properties/api/properties/params/items"
                    }
                },
                "description": {
                    "$id": "#/properties/api/properties/description",
                    "type": "string",
                    "title": "The description schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "登录"
                    ]
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
        },
        "componentsName": {
            "$id": "#/properties/componentsName",
            "type": "string",
            "title": "The componentsName schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "login"
            ]
        },
        "componentsPath": {
            "$id": "#/properties/componentsPath",
            "type": "string",
            "title": "The componentsPath schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "/Login/List/index.js"
            ]
        }
    },
    "additionalProperties": true
}