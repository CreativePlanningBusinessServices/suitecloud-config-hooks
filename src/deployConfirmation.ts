import { exec } from 'child_process';
import os from 'os';
import path from 'path';

export async function deployConfirmation(options: unknown): Promise<unknown> {
  console.log(options);
  const input = await getInput('Enter \\"Deploy\\" to confirm project deployment');
  if (input !== 'Deploy') {
    throw Error('Invalid confirmation text entered');
  }
  return options;
}

function getInput(question: string): Promise<string> {
  const executablePath = getExecuteablePath();
  return new Promise((resolve, reject) => {
    exec(`${executablePath} "${question}"`, (error, stdout) => {
      if (error) {
        reject(error);
      }
      resolve(stdout.trim());
    });
  });
}

function getExecuteablePath() {
  if (os.platform() === 'win32') {
    return path.join(__dirname, 'deploy-confirmation-win.exe');
  }
  return path.join(__dirname, 'deploy-confirmation-macos');
}
