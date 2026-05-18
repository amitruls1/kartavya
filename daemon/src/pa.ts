import { Epic, Task, TaskStatus, AgentPersona } from '@kartavya/shared';

export interface PlanningOutput {
  tasks: Task[];
  dependencyGraph: { [taskId: string]: string[] };
}

export class AgentFactory {
  static async spawn(persona: AgentPersona) {
    return new PrincipalArchitectAgent();
  }
}

export class PrincipalArchitectAgent {
  async analyzeRequirements(requirements: string): Promise<PlanningOutput> {
    // In MVP, this is a deterministic mock. In production, calls LLM for complex DAG logic.
    return {
      tasks: [
        {
          id: "task_1",
          epicId: "epic_1",
          assignedPersona: AgentPersona.UX,
          acceptanceCriteria: ["Design landing view"],
          status: TaskStatus.PENDING
        },
        {
          id: "task_2",
          epicId: "epic_1",
          assignedPersona: AgentPersona.ENGINEER,
          acceptanceCriteria: ["Implement email validation"],
          status: TaskStatus.PENDING
        }
      ],
      dependencyGraph: {
        "task_1": [],
        "task_2": ["task_1"]
      }
    };
  }
}
