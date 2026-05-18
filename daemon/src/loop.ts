import { Task, AgentPersona } from '@kartavya/shared';
import { DockerSandbox } from './sandbox';
import { DaemonClient, ProjectMemory } from './scm';

export class AgentExecutionLoop {
  private sandbox: DockerSandbox;
  private consecutiveTestFailures = 0;
  
  constructor(private task: Task, private projectDir: string) {
    this.sandbox = new DockerSandbox(task.id, projectDir);
    // Wire WebSocket emission for UI
    this.sandbox.on('stdout', (data) => console.log(`[WS-STDOUT] ${data}`));
    this.sandbox.on('stderr', (data) => console.error(`[WS-STDERR] ${data}`));
  }

  async run() {
    try {
      await this.sandbox.provision();

      // Phase 1: Hydration
      const context = await ProjectMemory.getGlobalContext();
      await this.invokeAgentPrompt(`HYDRATE`, { context, criteria: this.task.acceptanceCriteria });

      // Phase 2: Spec (Write tests)
      await this.invokeAgentPrompt(`WRITE_SPECS`, {});

      // Phase 3: Red (Validation)
      let specPasses = false;
      try {
        await this.sandbox.runCommand('npm test');
        specPasses = true; // Wait, red phase MUST fail
      } catch (e) {
        // Expected to fail
      }

      if (specPasses) {
        throw new Error('Test passed during RED phase. Invalid spec.');
      }

      // Phase 4: Green & Phase 5: Refactor
      let success = false;
      while (!success) {
        await this.invokeAgentPrompt(`IMPLEMENT`, {});
        try {
          await this.sandbox.runCommand('npm test');
          success = true;
          this.consecutiveTestFailures = 0;
        } catch (e) {
          this.consecutiveTestFailures++;
          if (this.consecutiveTestFailures > 5) {
             throw new Error('Infinite loop detected: > 5 failing tests. Escalating to human.');
          }
        }
      }

      // Phase 6: Commit & Purge
      await this.sandbox.runCommand('git add . && git commit -m "Automated commit: completed task"');
      
      const summary = {
        changes: "Implemented features matching criteria.",
        componentsAdded: [],
        specsPassed: this.task.acceptanceCriteria
      };
      
      await DaemonClient.purgeTaskContext(this.task.id, summary);

    } finally {
      await this.sandbox.teardown();
    }
  }

  // Mocking the LLM Agent invocation logic
  private async invokeAgentPrompt(phase: string, data: any) {
    console.log(`Agent Persona ${this.task.assignedPersona} executing phase: ${phase}`);
    // In a real system, this calls Gemini/Claude API and executes tool calls against the sandbox
  }
}
