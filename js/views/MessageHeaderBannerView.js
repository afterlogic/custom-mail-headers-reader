'use strict';

var ko = require('knockout');

function CMessageHeaderBannerView() {
    this.customHeaderBanner = ko.observable('');
}

CMessageHeaderBannerView.prototype.ViewTemplate = '%ModuleName%_MessageHeaderBannerView';

CMessageHeaderBannerView.prototype.doAfterPopulatingMessage = function (oMessageProps) {
    if (oMessageProps && oMessageProps.aCustom && oMessageProps.aCustom.HeaderBanners && oMessageProps.aCustom.HeaderBanners.length > 0) {
        this.customHeaderBanner(oMessageProps.aCustom.HeaderBanners[0]);
    } else {
        this.customHeaderBanner('');
    }
};

module.exports = new CMessageHeaderBannerView();
