import {PullRequestEvent} from '@octokit/webhooks-types'
import * as core from '@actions/core'

import {validate, process} from '../src/pr'
import {pr} from '../src/mock/pull_request_mock'
import {Options} from '../src/options'
import {JiraClientImpl} from '../src/jira'

let options: Options
let mock: PullRequestEvent

jest.mock('@actions/core')
jest.mock('../src/jira')
const mockClient = jest.mocked(JiraClientImpl, true)

beforeEach(() => {
  options = {
    project: 'SRENEW',
    ignoreAuthor: [],
    jira: {
      host: 'https://jira.example.com',
      email: 'test@example.com',
      apiToken: '1234567890'
    }
  }
})

describe('#validate', () => {
  beforeEach(() => {
    mock = JSON.parse(JSON.stringify(pr))
    mockClient.prototype.issueExists.mockResolvedValue(true)
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
    options.project = '(SRENEW|FOO)'

    mock.pull_request.head.ref = 'foo-FOO-1234'
    expect(await validate(mock, options)).toEqual(true)

    mock.pull_request.head.ref = 'foo-SRENEW-1234'
    expect(await validate(mock, options)).toEqual(true)
  })

  test('valid if ignoreAuthor matches', async () => {
    options.ignoreAuthor = ['dependabot[bot]']
    mock.pull_request.user.login = 'dependabot[bot]'

    expect(await validate(mock, options)).toEqual(true)
  })

  test('invalid when jira card does not exist', async () => {
    jest.spyOn(JiraClientImpl.prototype, 'issueExists').mockResolvedValue(false)

    mock.pull_request.title =
      'Update the README with new information | SRENEW-0000'

    expect(await validate(mock, options)).toEqual(false)
  })

  test('invalid when one jira card does not exist', async () => {
    mockClient.prototype.issueExists.mockImplementation(x =>
      Promise.resolve(x === 'SRENEW-1234')
    )

    mock.pull_request.title =
      'Update the README with new information | SRENEW-0000,SRENEW-1234'

    expect(await validate(mock, options)).toEqual(false)
  })
})

describe('#process', () => {
  let setFailedSpy: jest.SpyInstance
  let mockValidate: jest.Mock
  let context: any
  const mockInputs: Record<string, string> = {
    project: 'SRENEW',
    'jira-host': 'https://jira.example.com',
    'jira-email': 'test@example.com',
    'jira-api-token': '1234567890'
  }
  beforeEach(() => {
    context = {
      eventName: 'pull_request',
      payload: pr
    }
    mockValidate = jest.fn().mockResolvedValue(true)
    setFailedSpy = jest.spyOn(core, 'setFailed').mockReturnValue()
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string) => mockInputs[name])
  })

  test('calls validate w/ input options', async () => {
    await process(context, mockValidate)
    expect(mockValidate).toHaveBeenCalledTimes(1)
    expect(mockValidate).toHaveBeenCalledWith(pr, options)
  })

  test('calls setFailed when validation false', async () => {
    mockValidate.mockResolvedValue(false)

    await process(context, mockValidate)

    expect(mockValidate).toHaveBeenCalledTimes(1)
    expect(setFailedSpy).toHaveBeenCalledTimes(1)
  })

  test('no-op if not a pull request', async () => {
    context = {
      eventName: 'push'
    }
    await process(context, mockValidate)
    expect(mockValidate).not.toHaveBeenCalled()
    expect(setFailedSpy).not.toHaveBeenCalled()
  })
})
