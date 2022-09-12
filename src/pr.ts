import * as core from '@actions/core'
import {PullRequestEvent} from '@octokit/webhooks-types'
import {JiraClientImpl} from './jira'
import {Options} from './options'

/**
 * Pull requests are linked automatically if the issue key is included in the pull request's title or in the source branch name
 * @param event github pull request
 * @param project jira project, can be regex
 * @returns true if valid link to jira
 */
export async function validate(
  event: PullRequestEvent,
  options: Options
): Promise<boolean> {
  const {project} = options
  const re = RegExp(`(${project}-[0-9]+)+`, 'g')

  const jira = new JiraClientImpl(options.jira)

  core.debug('author ' + event.pull_request.user.login.toLowerCase())
  core.debug('title ' + event.pull_request.title)
  core.debug('head ' + event.pull_request.head.ref)

  for (const author of options.ignoreAuthor) {
    if (event.pull_request.user.login.toLowerCase() == author.toLowerCase()) {
      return true
    }
  }

  const titleMatch = event.pull_request.title.match(re) || []
  const refMatch = event.pull_request.head.ref.match(re) || []
  const matches = [...titleMatch, ...refMatch]

  if (matches.length < 1) {
    core.error(`No Jira issue found for ${project} in PR title or branch`)
    return false
  }

  for (const match of matches) {
    core.debug('Checking Jira issue ' + match)
    const exists = await jira.issueExists(match)
    if (!exists) {
      core.error('Issue does not exist: ' + match)
      return false
    }
  }

  return true
}
