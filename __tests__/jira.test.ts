import {expect, jest, test, describe, it, beforeEach} from '@jest/globals'
import {Version3Client} from 'jira.js'
import {JiraClient, JiraClientImpl, JiraConfig} from '../src/jira'

jest.mock('jira.js')
jest.mock('@actions/core')
const mockJira = jest.mocked(Version3Client)

beforeEach(() => {
  mockJira.mockClear()
})

describe('JiraClientImpl', () => {
  const jiraConfig: JiraConfig = {
    host: 'https://jira.example.com',
    email: 'test@example.com',
    apiToken: '1234567890'
  }

  test('constructor', async () => {
    new JiraClientImpl(jiraConfig)

    expect(mockJira).toHaveBeenCalledWith({
      host: 'https://jira.example.com',
      authentication: {
        basic: {
          email: 'test@example.com',
          apiToken: '1234567890'
        }
      }
    })
  })

  describe('#issueExists - issue exists', () => {
    let client: JiraClient
    const mockGetIssue = jest
      .fn<typeof Version3Client.prototype.issues.getIssue>()
      .mockResolvedValue({})

    beforeEach(() => {
      mockJira.mockImplementation(() => {
        return {issues: {getIssue: mockGetIssue}} as any
      })
      client = new JiraClientImpl(jiraConfig)
    })

    it('calls client.issues.getIssue()', async () => {
      await client.issueExists('SRENEW-1234')
      expect(mockGetIssue).toHaveBeenCalledTimes(1)
      expect(mockGetIssue).toHaveBeenCalledWith({issueIdOrKey: 'SRENEW-1234'})
    })

    it('returns true', async () => {
      const result = await client.issueExists('SRENEW-1234')
      expect(result).toEqual(true)
    })
  })

  describe('#issueExists - issue does not exists', () => {
    let client: JiraClient
    const mockGetIssue = jest
      .fn<typeof Version3Client.prototype.issues.getIssue>()
      .mockRejectedValue(new Error('Not Found'))

    beforeEach(() => {
      mockJira.mockImplementation(() => {
        return {issues: {getIssue: mockGetIssue}} as any
      })
      client = new JiraClientImpl(jiraConfig)
    })

    it('returns false', async () => {
      const result = await client.issueExists('SRENEW-1234')
      expect(result).toEqual(false)
    })

    it('calls client.issues.getIssue()', async () => {
      await client.issueExists('SRENEW-1234')
      expect(mockGetIssue).toHaveBeenCalledTimes(1)
      expect(mockGetIssue).toHaveBeenCalledWith({issueIdOrKey: 'SRENEW-1234'})
    })
  })
})
