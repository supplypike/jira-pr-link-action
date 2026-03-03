import * as github from '@actions/github'
import * as core from '@actions/core'
import { process } from './pr'

export async function main(): Promise<void> {
  try {
    await process(github.context)
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`)
  }
}

main()
