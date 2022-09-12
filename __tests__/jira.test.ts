import {Version3Client} from 'jira.js'
import {JiraClient, JiraClientImpl, JiraConfig} from '../src/jira'

jest.mock('jira.js')
const mockJira = jest.mocked(Version3Client, true)

beforeEach(() => {
  mockJira.mockClear()
})

describe('JiraClientImpl', () => {
  const jiraConfig: JiraConfig = {
    host: 'https://jira.example.com',
    username: 'user',
    password: 'pass'
  }

  test('constructor', async () => {
    new JiraClientImpl(jiraConfig)

    expect(mockJira).toHaveBeenCalledWith({
      host: 'https://jira.example.com',
      authentication: {
        basic: {
          username: 'user',
          password: 'pass'
        }
      }
    })
  })

  describe('#issueExists - issue exists', () => {
    let client: JiraClient
    let mockGetIssue: jest.Mock

    beforeEach(() => {
      mockGetIssue = jest.fn().mockResolvedValue({})
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
    let mockGetIssue: jest.Mock

    beforeEach(() => {
      mockGetIssue = jest.fn().mockRejectedValue(new Error('Not Found'))
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
