import handleList from './list/index';
import handleForm from './form/index';
import handleDetail from './detail/index';
import handleApi from './api/index';

const strategy = {
    "form": function(api,text) {
        // form 
        return handleForm(api,text);
    },
    "detail" : function(api,text) {
        return handleDetail(api,text);
    },
    "list" : function(api,text) {
        // console.log('text1', text);
        return handleList(api,text);
    },
    "api": function(api, text) {
        return handleApi(api, text);
    }
};

export default strategy;