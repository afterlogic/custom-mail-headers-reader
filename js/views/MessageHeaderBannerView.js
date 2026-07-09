'use strict';

var ko = require('knockout');

function CMessageHeaderBannerView() {
    this.currentMessage = ko.observable(null);
}

CMessageHeaderBannerView.prototype.ViewTemplate = '%ModuleName%_MessageHeaderBannerView';

CMessageHeaderBannerView.prototype.onBind = function (oMessage) {
    this.currentMessage(oMessage);
};

module.exports = new CMessageHeaderBannerView();
