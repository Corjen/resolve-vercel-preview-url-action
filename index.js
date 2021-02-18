const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch')
try {
  // `who-to-greet` input defined in action metadata file

  const vercelToken = core.getInput('vercel_token')
  const teamId = core.getInput('team_id')
  const projectId = core.getInput('project_id')
  const githubCommitRef = core.getInput('github_commit_ref')
  console.log(`teamId ${teamId}`);
  console.log(`projectId ${projectId}`);
  console.log(`githubCommitRef ${githubCommitRef}`);
  console.log(`url https://api.zeit.co/v5/now/deployments?teamId=${teamId}&projectId=${projectId}`)

  fetch(`https://api.zeit.co/v5/now/deployments?teamId=${teamId}&projectId=${projectId}`, {headers: {
    authorization: `Bearer ${vercelToken}`
  }}).then(res => res.json()).then(response => {
    console.log(response)

    const filtered = response.deployments.filter(d => d.meta.githubCommitRef === githubCommitRef)
    console.log(filtered)
    if(filtered.length === 0) {
      throw new Error('No deployments found')
    }

    core.setOutput("url", filtered[0].url);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  })


} catch (error) {
  core.setFailed(error.message);
}
