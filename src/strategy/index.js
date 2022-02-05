import handleList from './list/index';
import handleForm from './form/index';
import handleDetail from './detail/index';
import handleAction from './action/index';
// import handleApi from './api/index';

const strategy = {
    "form": function(api,text, options) {
        // form 
        return handleForm(api,text, options);
    },
    "detail" : function(api,text, options) {
        return handleDetail(api,text, options);
    },
    "list" : function(api,text, options) {
        // console.log('text1', text);
        return handleList(api,text, options);
    },
    // "api": function(api, text, options) {
    //     return handleApi(api, text, options);
    // },
    "action": function(api, text, options) {
        return handleAction(api, text, options);
    }
};

export default strategy;