import * as github from '@actions/github';
import * as core from '@actions/core';

async function run() {
  const base = github.context.payload.pull_request.base.sha;
  const head = github.context.payload.pull_request.head.sha;

  const token = core.getInput('github-token');
  const client = github.getOctokit(token);
  const context = github.context;

  const response = await client.rest.pulls.get({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number,
    mediaType: {
      format: 'patch'
    }
  });

  core.notice(
    `Patch result: ${JSON.stringify(response)}`
  );

  const response1 = await client.rest.pulls.get({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number,
    mediaType: {
      format: 'sha'
    }
  });

  const response2 = await client.rest.pulls.get({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    pull_number: context.payload.pull_request.number,
    mediaType: {
      format: 'diff'
    }
  });

  core.notice(
    `Diff result: ${JSON.stringify(response2)}`
  );

  core.notice(
    `SHA result: ${JSON.stringify(response1)}`
  );

  core.setOutput(
    "changed",
    JSON.stringify(response)
  );
}

run().catch(error => {
  console.log(error);
  core.setFailed(error.message);
});
