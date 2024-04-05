This action scans the **branch name** and **title** of a pull request. 
* At least one project name must be found with the `project` input regex
* A matched JIRA ticket is checked against the JIRA API to ensure it exists

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
        uses: supplypike/jira-pr-link-action@v3
        with:
          ignore-author: dependabot[bot]
          project: "FOO"
          jira-host: ${{ secrets.JIRA_HOST }}
          jira-email: ${{ secrets.JIRA_EMAIL }}
          jira-api-token: ${{ secrets.JIRA_API_TOKEN }}
```

### Inputs

These are some of the supported input parameters of action.

| **Parameter**        | **Description**                              | **Required?** | **Note**                                                                                      |
|----------------------|----------------------------------------------|---------------| ----------------------------------------------------------------------------------------------|
| **`project`**        | JIRA Project Name                            | YES           |  Can match a Regex of project names examples: `(FOO\|BAR)`. Use `.*` To match any             |
| **`jira-host`**      | JIRA server URL                              | YES           |                                                                                               |
| **`jira-email`**     | Login of JIRA user                           | YES           |                                                                                               |
| **`jira-api-token`** | The token that goes with the `jira-email`    | YES           |                                                                                               |
| **`ignore-author`**  | Comma seperated list of PR authors to ignore | NO            |                                                                                               |
