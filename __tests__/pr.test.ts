import {PullRequestEvent} from '@octokit/webhooks-types'
import {validate} from '../src/pr'
import {pr} from '../src/mock/pull_request_mock'
import {Options} from '../src/options'
import {JiraClientImpl} from '../src/jira'


let options: Options
let mock: PullRequestEvent
let jiraSpy: jest.SpyInstance

jest.mock("@actions/core")
jest.mock("../src/jira")

beforeEach(() => {
  mock = JSON.parse(JSON.stringify(pr))

  jiraSpy = jest.spyOn(JiraClientImpl.prototype, "issueExists").mockResolvedValue(true)
  options = {project: 'SRENEW', ignoreAuthor: [], jira: {host: 'https://jira.example.com', username: 'user', password: 'pass'}}
})

test('invalid PR', async () => {
  expect(await validate(pr, options)).toEqual(false)
})

test('valid PR title', async () => {
  mock.pull_request.title =
    'Update the README with new information | SRENEW-1234'

  expect(await validate(mock, options)).toEqual(true)
})

test('valid PR branch', async () => {
  mock.pull_request.head.ref = 'foo-SRENEW-1234'

  expect(await validate(mock, options)).toEqual(true)
})

test('works with regex options', async () => {
  mock.pull_request.head.ref = 'foo-FOO-1234'
  options.project = '(?:SRENEW|FOO)'

  expect(await validate(mock, options)).toEqual(true)
})

test('valid if ignoreAuthor matches', async () => {
  options.ignoreAuthor = ['dependabot[bot]']
  mock.pull_request.user.login = 'dependabot[bot]'

  expect(await validate(mock, options)).toEqual(true)
})

test('invalid when jira card does not exist', async () => {
  jest.spyOn(JiraClientImpl.prototype, "issueExists").mockResolvedValue(false)

  mock.pull_request.title =
    'Update the README with new information | SRENEW-0000'

  expect(await validate(mock, options)).toEqual(false)
})

test('invalid when one jira card does not exist', async () => {
  jest.spyOn(JiraClientImpl.prototype, "issueExists").mockImplementation(x => Promise.resolve(x === 'SRENEW-1234'))

  mock.pull_request.title =
    'Update the README with new information | SRENEW-0000,SRENEW-1234'

  expect(await validate(mock, options)).toEqual(false)
})