<?php
namespace Aurora\Modules\CustomMailHeadersReader;

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
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
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
                                if (!empty($r['badge'])) {
                                    $customHeader['badge'] = $r['badge'];
                                }
                                if (!empty($r['banner'])) {
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
