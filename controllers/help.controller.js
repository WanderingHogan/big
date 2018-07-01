'use strict';
module.exports =function(commonResponseWrapper, ReviewData) {
    let module = {};

    // TODO: standardize response with response codes, something like:
    // {status: success, data: <data>} or {status: fail, message: 'something fucked up'}

    // TODO: We aren't using ReviewData now, should remove until we need it

    module.help = function(req, res){
        commonResponseWrapper.code = 200;
        commonResponseWrapper.content = 'Add some detailed docs here in plaintext or something later';
        res.jsonp(commonResponseWrapper)
    }

    return module;
}