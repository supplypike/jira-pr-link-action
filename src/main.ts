import * as github from '@actions/github'
import * as core from '@actions/core'
import {process} from './pr'

export async function main(): Promise<void> {
  try {
    await process(github.context)
  } catch (error) {
    core.error(`Error caught in main: ${error}`)
  }
}

main()
