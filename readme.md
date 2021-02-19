# Overview

Fetches the latest deployment url of a specific vercel project. Handy if you need to wait for a specific project or projects before running E2E tests, lighthouse, etc. Works great with [UnlyEd/github-action-await-vercel](UnlyEd/github-action-await-vercel)

## Inputs

- `vercel_token`: Vercel token for authentication

- `team_id`: Your team id from .vercel/project.json

- `project_id`: The project id from .vercel/project.json

- `github_commit_ref`: The commit ref you want to filter on.

## Example

```yml

- name: Inject slug/short variables
  uses: rlespinasse/github-slug-action@v3.x

- name: Resolving deployment url from Vercel
  id: vercel_url
  uses: corjen/resolve-vercel-preview-url-action@1.0
  with:
    vercel_token: ${{ secrets.VERCEl_TOKEN }}
    team_id: "xxx"
    project_id: "xxx"
    github_commit_ref: ${{env.GITHUB_HEAD_REF_SLUG}}

- name: Wait for vercel project to be ready
  uses: UnlyEd/github-action-await-vercel@v1.1.1
  env:
    VERCEL_TOKEN: ${{ secrets.VERCEl_TOKEN }}
  with:
    deployment-url: ${{ steps.vercel_url.outputs.url }} # Must only contain the domain name (no http prefix, etc.)
    timeout: 600 # Wait for 600 seconds before failing

# Run e2e tests, lighthouse, etc

```
