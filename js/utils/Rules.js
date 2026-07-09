'use strict';

var App = require('%PathToCoreWebclientModule%/js/App.js');

module.exports = {
    getRules: function () {
        // request server module to get settings
        try {
            var oAppData = App.getAppData();
            // simple sync require won't work for server data; try to read module settings via ModulesManager
            // fallback: read rules from settings file via ajax
        } catch (e) {}
        return require('%PathToCoreWebclientModule%/js/Utils.js').pObject([]);
    }
};
