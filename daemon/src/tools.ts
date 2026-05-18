import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import { ProjectMemory } from './scm';

const execAsync = promisify(exec);

export class ToolRegistry {
  static async execute_bash(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
    return execAsync(command, { cwd });
  }

  static async read_file(path: string): Promise<string> {
    return fs.readFile(path, 'utf-8');
  }

  static async write_file(path: string, content: string): Promise<void> {
    await fs.ensureFile(path);
    return fs.writeFile(path, content, 'utf-8');
  }

  static async git_branch(name: string, cwd: string): Promise<void> {
    await execAsync(`git checkout -b ${name}`, { cwd });
  }

  static async git_commit(msg: string, cwd: string): Promise<void> {
    await execAsync(`git add . && git commit -m "${msg}"`, { cwd });
  }

  static async git_pr(title: string, cwd: string): Promise<void> {
    // Assuming gh cli is installed and authenticated for PRs
    await execAsync(`gh pr create --title "${title}" --fill`, { cwd });
  }

  static async query_scm(query: string): Promise<string> {
    // For MVP, simply returns the full memory or a primitive string search
    const fullContext = await ProjectMemory.getGlobalContext();
    return fullContext.includes(query) ? fullContext : "Query not found in recent context.";
  }
}
