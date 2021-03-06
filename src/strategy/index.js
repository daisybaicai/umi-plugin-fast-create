import handleList from './list/index';
import handleForm from './form/index';
import handleDetail from './detail/index';

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
    } 
};

export default strategy;