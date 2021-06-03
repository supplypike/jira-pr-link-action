import * as core from '@actions/core'
import * as github from '@actions/github'
import {PullRequestEvent} from '@octokit/webhooks-definitions/schema'
import {getInput} from './options'
import {validate} from './pr'

async function run(): Promise<void> {
  try {
    if (github.context.eventName !== 'pull_request') {
      core.debug('Not a pull request')
      return
    }

    const ev = github.context.payload as PullRequestEvent
    const valid = validate(ev, getInput())

    if (!valid) {
      core.setFailed(
        'Invalid Pull Request: missing JIRA project in title or branch'
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
