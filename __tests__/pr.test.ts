import {PullRequestEvent, PushEvent} from '@octokit/webhooks-definitions/schema'
import {validate} from '../src/pr'
import {pr} from '../src/mock/pull_request_mock'

const project = 'SRENEW'
let mock: PullRequestEvent

beforeEach(() => {
  mock = JSON.parse(JSON.stringify(pr))
})

test('invalid PR', async () => {
  expect(validate(pr, project)).toEqual(false)
})

test.skip('valid PR title', async () => {
  mock.pull_request.title =
    'Update the README with new information | SRENEW-1234'

  expect(validate(mock, project)).toEqual(true)
})

test('valid PR branch', async () => {
  mock.pull_request.head.ref = 'foo-SRENEW-1234'

  expect(validate(mock, project)).toEqual(true)
})

test('works with regex project', async () => {
  mock.pull_request.head.ref = 'foo-FOO-1234'
  const reProject = `[FOO|SRENEW]`

  expect(validate(mock, reProject)).toEqual(true)
})
