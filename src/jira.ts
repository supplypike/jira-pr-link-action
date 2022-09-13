import {Version3Client} from 'jira.js'
import * as core from '@actions/core'
export interface JiraConfig {
  host: string
  email: string
  apiToken: string
}

export interface JiraClient {
  issueExists: (issueIdOrKey: string) => Promise<boolean>
}

export class JiraClientImpl implements JiraClient {
  private readonly client: Version3Client

  constructor({host, email, apiToken}: JiraConfig) {
    this.client = new Version3Client({
      host,
      authentication: {
        basic: {
          email,
          apiToken
        }
      }
    })
  }

  async issueExists(issueIdOrKey: string): Promise<boolean> {
    try {
      await this.client.issues.getIssue({issueIdOrKey})
      return true
    } catch (error) {
      core.debug(`getIssue error: ${error}`)
      return false
    }
  }
}
