CustomMailHeadersReader

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
