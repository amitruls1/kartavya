import fs from 'fs-extra';
import path from 'path';

const MEMORY_DIR = path.join(process.cwd(), '.kartavya', 'memory');
const GLOBAL_LEDGER_PATH = path.join(MEMORY_DIR, 'ledger.md');

export interface AgentSummary {
  changes: string;
  componentsAdded: string[];
  specsPassed: string[];
}

export class ProjectMemory {
  static async init() {
    await fs.ensureDir(MEMORY_DIR);
    if (!(await fs.pathExists(GLOBAL_LEDGER_PATH))) {
      await fs.writeFile(GLOBAL_LEDGER_PATH, '# Global Project Memory\n\n');
    }
  }

  static async getGlobalContext(projectId?: string): Promise<string> {
    await this.init();
    return fs.readFile(GLOBAL_LEDGER_PATH, 'utf-8');
  }

  static async appendToGlobalContext(entry: string) {
    await this.init();
    await fs.appendFile(GLOBAL_LEDGER_PATH, `\n${entry}\n`);
  }
}

export class DaemonClient {
  static async purgeTaskContext(taskId: string, agentSummary: AgentSummary) {
    const entry = `## Task ${taskId} Completed\n` +
      `- **Changes:** ${agentSummary.changes}\n` +
      `- **Components Added:** ${agentSummary.componentsAdded.join(', ')}\n` +
      `- **Specs Passed:** ${agentSummary.specsPassed.join(', ')}\n`;
    
    await ProjectMemory.appendToGlobalContext(entry);
  }
}
