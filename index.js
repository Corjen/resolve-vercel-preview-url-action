const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch')
const wait = require('./')

async function run () {
  try {
    const vercelToken = core.getInput('vercel_token')
    const teamId = core.getInput('team_id')
    const projectId = core.getInput('project_id')
    const githubCommitRef = core.getInput('github_commit_ref')

    await wait(5000)
    const response = fetch(`https://api.zeit.co/v5/now/deployments?teamId=${teamId}&projectId=${projectId}`, {headers: {
      authorization: `Bearer ${vercelToken}`
    }}).then(res.json)

    core.info(`Input`, {
      projectId,
      githubCommitRef
    })

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
  }
}

run()
