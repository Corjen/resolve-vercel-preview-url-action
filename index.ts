import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fetch from 'node-fetch'
import { handleFetchResponse } from './handle-fetch-response'
import {wait} from './wait'

async function run () {
  try {
    const vercelToken = core.getInput('vercel_token')
    const teamId = core.getInput('team_id')
    const projectId = core.getInput('project_id')
    const githubCommitSha = core.getInput('github_commit_sha')

    await wait(5000)
    const response = await fetch(`https://api.zeit.co/v5/now/deployments?teamId=${teamId}&projectId=${projectId}`, {headers: {
      authorization: `Bearer ${vercelToken}`
    }}).then(handleFetchResponse)

    core.info(JSON.stringify({
      projectId,
      githubCommitSha
    }))

    const filtered = response.deployments.filter(d => d.meta.githubCommitSha === githubCommitSha)
    core.info(JSON.stringify({deployments: response.deployments.map(d => d.uid)}))

    if(filtered.length === 0) {
      throw new Error(`No deployments found`)
    }

    console.log(`url: ${filtered[0].url}`)

    core.setOutput("url", filtered[0].url);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

  } catch (error) {
    core.setFailed(error.message);
    process.exit(1)
  }
}

run()
