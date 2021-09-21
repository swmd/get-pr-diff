import * as github from '@actions/github';
import * as core from '@actions/core';

async function run() {
  const base = github.context.payload.pull_request.base.sha;
  const head = github.context.payload.pull_request.head.sha;

  const token = core.getInput('github-token');
  const client = github.getOctokit(token);
  const context = github.context;
  core.notice(`====== github context ===========`);
  core.notice(JSON.stringify(context));
  core.notice('===================');
  const response = await client.rest.pulls.get({
    owner: context.payload.repository.owner.login,
    repo: github.context.payload.repository.name,
    pull_number: github.context.pull_request.number,
    mediaType: {
      format: 'diff'
    }
  });

  core.notice(
    `Result: ${JSON.stringify(response)}`
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
