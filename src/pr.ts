import {PullRequestEvent} from '@octokit/webhooks-definitions/schema'
import {Options} from './options'

/**
 * Pull requests are linked automatically if the issue key is included in the pull request's title or in the source branch name
 * @param event github pull request
 * @param project jira project, can be regex
 * @returns true if valid link to jira
 */
export function validate(event: PullRequestEvent, options: Options): boolean {
  const {project} = options
  const re = RegExp(`${project}-[0-9]+`)

  for (const author of options.ignoreAuthor) {
    if (event.pull_request.user.login.toLowerCase() == author.toLowerCase()) {
      return true
    }
  }

  if (event.pull_request.title.match(re)) {
    return true
  }

  if (event.pull_request.head.ref.match(re)) {
    return true
  }
  return false
}
