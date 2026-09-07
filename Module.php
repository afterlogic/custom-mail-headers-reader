<?php

namespace Aurora\Modules\CustomMailHeadersReader;

/**
 * Main Files module. It provides PHP and Web APIs for managing files.
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2026, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractModule
{
    /**
     * @return Module
     */
    public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    public function init()
    {
        $this->subscribeEvent('System::toResponseArray::before', array($this, 'onBeforeToResponseArray'));
    }

    /**
     * Adds custom fields to message before it's converted to response array.
     * Injects badge/banner based on configured rules.
     *
     * @param array $aArgs
     */
    public function onBeforeToResponseArray(&$aArgs)
    {
        if ($aArgs && isset($aArgs[0]) && $aArgs[0] instanceof \Aurora\Modules\Mail\Classes\Message) {
            $oMessage = $aArgs[0];

            $oHeaders = $oMessage->getHeadersCollection();

            $aRules = is_array($this->oModuleSettings->Rules) ? $this->oModuleSettings->Rules : array();
            $customHeaders = [];
            if ($aRules && 0 < count($aRules)) {
                foreach ($aRules as $r) {
                    try {
                        if (!isset($r['condition'])) {
                            continue;
                        }

                        $parts = explode(':', $r['condition'], 2);
                        $headerName = isset($parts[0]) ? trim($parts[0]) : '';
                        $headerValue = isset($parts[1]) ? trim($parts[1]) : '';

                        if ($headerName === '') {
                            continue;
                        }

                        $oHeader = $oHeaders->GetByName($headerName);
                        $customHeader = [];
                        if ($oHeader) {
                            $sValue = $oHeader->Value();
                            if (0 === strcasecmp(trim($sValue), $headerValue)) {
                                if (!isset($r['badge'])) {
                                    $customHeader['badge'] = $this->i18N('EXTERNAL_MESSAGE_BADGE');
                                } elseif (!empty($r['badge'])) {
                                    $customHeader['badge'] = $r['badge'];
                                }
                                if (!isset($r['banner'])) {
                                    $customHeader['banner'] = $this->i18N('EXTERNAL_MESSAGE_BANNER');
                                } elseif (!empty($r['banner'])) {
                                    $customHeader['banner'] = $r['banner'];
                                }
                                if (!empty($customHeader)) {
                                    $customHeaders[] = $customHeader;
                                }
                            }
                        }
                    } catch (\Exception $e) {
                        // ignore malformed rule
                    }
                }
            }

            $oMessage->addCustom('CustomHeaders', $customHeaders);
        }

    }

    public function GetSettings()
    {
        return [
            'Rules' => $this->oModuleSettings->Rules,
        ];
    }
}
