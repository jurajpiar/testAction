import * as github from '@actions/github'
import {WebhookPayload} from '@actions/github/lib/interfaces'
import fs from 'fs'
import yaml from 'js-yaml'

import * as core from '@actions/core'
import run from '../src/main'

const mockInputs = {
  INPUT_GITHUB_TOKEN: 'mockToken',
  INPUT_BRANCHES: 'develop,staging'
}

const mockPayload: WebhookPayload = {
  pusher: {
    name: 'mona'
  }
}

beforeEach(() => {
  jest.resetModules()
  const doc = yaml.load(
    fs.readFileSync(__dirname + '/../action.yml', 'utf8')
  ) as any
  Object.keys(mockInputs).forEach(name => {
    process.env[name] = mockInputs[name as keyof typeof mockInputs]
  })
  github.context.payload = mockPayload
})

afterEach(() => {
  Object.keys(mockInputs).forEach(name => {
    delete process.env[name]
  })
})

describe('test action', () => {
  it('expects github token', async () => {
    const debugMock = jest.spyOn(core, 'debug')
    await run()
    expect(debugMock).toHaveBeenCalled()
    expect(debugMock).toHaveBeenCalledWith(mockInputs.INPUT_GITHUB_TOKEN)
  })
  it('expects list of branches', async () => {
    const debugMock = jest.spyOn(core, 'debug')
    await run()
    expect(debugMock).toHaveBeenCalled()
    expect(debugMock).toHaveBeenCalledWith(mockInputs.INPUT_BRANCHES)
  })
})
