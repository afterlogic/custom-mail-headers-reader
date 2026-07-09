# Custom Mail Headers Reader

This module reads configured header rules from data/settings/modules/CustomMailHeadersReader.config.json
and adds a badge to message list items and a banner to the message view when a rule matches.

Config file format (JSON):
{
  "rules": [
    {
      "condition": "X-External-Mail: YES",
      "badge": "external",
      "banner": "This email originated outside your organization."
    }
  ]
}

The badge and banner options can be omitted. In this case, the values from the language translations will be used instead.
# Development
This repository has a pre-commit hook. To make it work you need to configure git to use the particular hooks folder.

`git config --local core.hooksPath .githooks/`

# License
This module is licensed under AGPLv3 license if free version of the product is used or Afterlogic Software License if commercial version of the product was purchased.