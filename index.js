import * as github from '@actions/github';
import * as core from '@actions/core';

async function run() {
  let isValid = true;

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

  core.debug(
    `PR data: ${JSON.stringify(response.data)}`
  );
  
  if (response.data.deletions > 0) {
    isValid = false;
  }

  core.setOutput("valid", isValid);

  if (!isValid) {
    core.setFailed("Pull request should not contain any deletions.");
  }
}

run().catch(error => {
  console.log(error);
  core.setFailed(error.message);
});
