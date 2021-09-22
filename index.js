import * as github from '@actions/github';
import * as core from '@actions/core';

async function run() {
  let output = 'VALID';

  const token = core.getInput('github-token');
  const client = github.getOctokit(token);
  const context = github.context;

  const response = await client.rest.pulls.get({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number,
    mediaType: {
      format: 'sha'
    }
  });

  core.notice(`PR data: ${JSON.stringify(response.data)}`);
  
  if (response.data.deletions > 0) {
    output = 'INVALID';
  }

  core.notice(`Setting output: ${output}`);
  core.setOutput("valid", output);

  if (output === 'INVALID') {
    core.setFailed("Pull request should not contain any deletions.");
  }
}

run().catch(error => {
  console.log(error);
  core.setFailed(error.message);
});
