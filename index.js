import * as github from '@actions/github';
import * as core from '@actions/core';

async function run() {
  const base = github.context.payload.pull_request.base.sha;
  const head = github.context.payload.pull_request.head.sha;

  const client = github.getOctokit(core.getInput('token', {required: true}));
  const response = await client.repos.compareCommits({
    base,
    head,
    owner: context.repo.owner,
    repo: context.repo.repo,
  });

  const files = response.data.files;
  const fileNames = files.map((file) => file.filename);

  core.setOutput(
    "changed",
    JSON.stringify(files)
  );
}

run ();
