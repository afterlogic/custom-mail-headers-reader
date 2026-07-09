'use strict';

var App = require('%PathToCoreWebclientModule%/js/App.js');
var TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js');
var Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js');

module.exports = function (oAppData) {
    // no settings from server required here, we will read rules via server module if needed
    if (App.isUserNormalOrTenant()) {
        return {
            start: function (ModulesManager) {
                // rely on server to add custom fields to messages (Custom.*)
                // register controllers to add badge and banner
                App.subscribeEvent('MailWebclient::RegisterMessagePaneController', function (fRegisterMessagePaneController) {
                    fRegisterMessagePaneController(require('modules/%ModuleName%/js/views/MessageHeaderBannerView.js'), 'BeforeMessageHeaders');
                });
                App.subscribeEvent('MailWebclient::ConstructView::after', function (oParams) {
                    if (oParams.Name === 'CMessageListView' && oParams.MailCache) {
                        var registerListController = function (oController, sPlace) {
                            oParams.View.registerController(oController, sPlace);
                        };
                        // load controller for list items by subscribing parse event
                        App.subscribeEvent('MailWebclient::ParseMessageListItem::after', function (params) {
                            var msg = params.msg;
                            try {
                                if (msg && msg.Custom) {
                                    var custom = msg.Custom;
                                    var customHeaders = custom.CustomHeaders;
                                    
                                    if (!customHeaders) {
                                        customHeaders = [];
                                    }
                                    
                                    // Initialize HeaderBanners as plain array
                                    if (!msg.Custom.HeaderBanners) {
                                        msg.Custom.HeaderBanners = [];
                                    }
                                    
                                    if (Array.isArray(customHeaders) && customHeaders.length > 0) {
                                        for (var i = 0; i < customHeaders.length; i++) {
                                            var header = customHeaders[i];
                                            if (header && header.badge) {
                                                msg.setCustomLabel(header.badge, header.badge, 'custom-header-badge');
                                            }
                                            if (header && header.banner) {
                                                msg.Custom.HeaderBanners.push(header.banner);
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error('ParseMessageListItem error:', e);
                            }
                        });
                        // also apply when full message parsed to inject banner into printable DOM
                        App.subscribeEvent('MailWebclient::ParseMessage::after', function (params) {
                            var msg = params.msg;
                            try {
                                if (msg && msg.Custom) {
                                    var custom = msg.Custom;
                                    var customHeaders = custom.CustomHeaders;
                                    
                                    // Initialize HeaderBanners as plain array
                                    if (!msg.Custom.HeaderBanners) {
                                        msg.Custom.HeaderBanners = [];
                                    }
                                    
                                    if (Array.isArray(customHeaders) && customHeaders.length > 0) {
                                        for (var i = 0; i < customHeaders.length; i++) {
                                            var header = customHeaders[i];
                                            if (header && header.badge) {
                                                msg.setCustomLabel(header.badge, header.badge, 'custom-header-badge');
                                            }
                                            if (header && header.banner) {
                                                msg.Custom.HeaderBanners.push(header.banner);
                                            }
                                        }
                                    }
                                    
                                    // inject into printable DOM if present
                                    try {
                                        if (msg.Custom.HeaderBanners && msg.Custom.HeaderBanners.length > 0) {
                                            var bannerHtml = msg.Custom.HeaderBanners.map(function(b) {
                                                return '<div class="custom-external-banner"><div class="custom-external-banner-inner">' + TextUtils.encodeHtml(b) + '</div></div>';
                                            }).join('');
                                            var sDom = msg.domMessageForPrint ? msg.domMessageForPrint() : '';
                                            if (sDom) {
                                                msg.domMessageForPrint(bannerHtml + sDom);
                                            }
                                            var sNewWin = msg.textBodyForNewWindow ? msg.textBodyForNewWindow() : '';
                                            if (sNewWin) {
                                                msg.textBodyForNewWindow(bannerHtml + sNewWin);
                                            }
                                        }
                                    } catch (e) {
                                        console.error('ParseMessage printable DOM error:', e);
                                    }
                                }
                            } catch (e) {
                                console.error('ParseMessage error:', e);
                            }
                        });
                    }
                });
            }
        };
    }
    return null;
};
