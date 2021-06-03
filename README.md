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
        uses: supplypike/jira-pr-link-action@v1
        with:
          ignore-author: dependabot[bot]
          project: "SRENEW"
```
