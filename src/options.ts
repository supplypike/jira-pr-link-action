import * as core from '@actions/core'

export interface Options {
  project: string
  ignoreAuthor: string[]
}

export function getInput(): Options {
  const project = core.getInput('project', {required: true})
  const ignoreAuthor = core.getInput('ignore-author').split(',')

  return {
    project,
    ignoreAuthor
  }
}
