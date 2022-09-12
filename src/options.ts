import * as core from '@actions/core'

export interface Options {
  project: string
  ignoreAuthor: string[]
  jira: JiraConfig
}

export function getInput(): Options {
  const project = core.getInput('project', {required: true})
  const ignoreAuthor = core.getInput('ignore-author').split(',')
  const jiraHost = core.getInput('jira-host', {required: true})
  const jiraUsername = core.getInput('jira-username', {required: true})
  const jiraPassword = core.getInput('jira-password', {required: true})

  return {
    project,
    ignoreAuthor,
    jira: {
      host: jiraHost,
      username: jiraUsername,
      password: jiraPassword,
    }
  }
}
