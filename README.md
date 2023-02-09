## Usage:

```yaml
name: JIRA Connection

on:
  pull_request:
    types:
      - opened
      - reopened
      - edited
      - synchronize

jobs:
  enforce-issue:
    runs-on: ubuntu-latest
    name: JIRA Association
    steps:
      - name: Check for JIRA ISSUE
        id: check
        uses: aumni-fund/tool-github-action-jira-pr-link@v1
        with:
          ignore-author: dependabot[bot]
          project: 'DEV'
```
