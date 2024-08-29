import { exec } from 'child_process';
import { chdir, cwd } from 'process';

export async function preventDeployWithoutRemote(options: DeployOptions): Promise<DeployOptions> {
  if (await hasRemote(options.projectPath)) {
    return options;
  }
  throw new Error('You cannot deploy code from a branch which does not have a remote. Please push this branch.');
}

export async function preventDeployWithUncommittedChanges(options: DeployOptions): Promise<DeployOptions> {
  if ((await hasUncommittedChanges(options.projectPath)) || (await hasUnpushedChanges(options.projectPath))) {
    throw new Error('You cannot deploy to a production account from a branch with uncommitted changes. Please commit and push all changes on this branch.');
  }
  return options;
}

export function isProd(options: DeployOptions): boolean {
  const authId = options.arguments.authid.trim();
  const isDigitsOnly = !isNaN(Number(authId));
  return isDigitsOnly;
}

function shell(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (_, stdout, stderr) => {
      if (stderr.length > 1) {
        return reject(stderr);
      }
      return resolve(stdout);
    });
  });
}

async function withDirectory<T>(directory: string, fn: () => Promise<T>): Promise<T> {
  const currentDirectory = cwd();
  chdir(directory);
  const result = await fn();
  chdir(currentDirectory);
  return result;
}

async function hasRemote(directory: string): Promise<boolean> {
  const output = await withDirectory(directory, async () => {
    return await shell(`git for-each-ref --format='%(upstream:short)' "$(git symbolic-ref -q HEAD)"`);
  });
  return output.trim().length > 0;
}

async function hasUncommittedChanges(directory: string): Promise<boolean> {
  const output = await withDirectory(directory, async () => {
    return await shell(`git status -s`);
  });
  return output.trim().length > 0;
}

async function hasUnpushedChanges(directory: string): Promise<boolean> {
  const output = await withDirectory(directory, async () => {
    return await shell(`git cherry -v`);
  });
  return output.trim().length > 0;
}

type DeployOptions = {
  command: string;
  projectPath: string;
  arguments: Arguments;
};

type Arguments = {
  accountspecificvalues: string;
  authid: string;
};
