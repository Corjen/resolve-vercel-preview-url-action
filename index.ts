import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fetch from 'node-fetch'
import {wait} from './wait'

async function run () {
  try {
    const vercelToken = core.getInput('vercel_token')
    const teamId = core.getInput('team_id')
    const projectId = core.getInput('project_id')
    const githubCommitRef = core.getInput('github_commit_ref')

    await wait(5000)
    const response = fetch(`https://api.zeit.co/v5/now/deployments?teamId=${teamId}&projectId=${projectId}`, {headers: {
      authorization: `Bearer ${vercelToken}`
    }}).then((res) => res.json())

    core.info(JSON.stringify({
      projectId,
      githubCommitRef
    }))

    const filtered = response.deployments.filter(d => d.meta.githubCommitRef === githubCommitRef)

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