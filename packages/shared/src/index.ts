export enum EpicStatus {
  DRAFT = "DRAFT",
  ARCHITECTING = "ARCHITECTING",
  EXECUTING = "EXECUTING",
  REVIEW = "REVIEW",
  DONE = "DONE"
}

export enum TaskStatus {
  PENDING = "PENDING",
  WRITING_SPECS = "WRITING_SPECS",
  IMPLEMENTING = "IMPLEMENTING",
  TESTING = "TESTING",
  DONE = "DONE"
}

export enum AgentPersona {
  UX = "UX",
  ENGINEER = "ENGINEER",
  TESTER = "TESTER",
  REVIEWER = "REVIEWER",
  PRINCIPAL_ARCHITECT = "PRINCIPAL_ARCHITECT"
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  requirements: string;
  status: EpicStatus;
  dependencyGraph: any; // DAG object defining parallel/sequential sub-tasks
  summaries_summary: string;
}

export interface Task {
  id: string;
  epicId: string | null;
  assignedPersona: AgentPersona;
  acceptanceCriteria: string[];
  status: TaskStatus;
  containerId?: string; // docker_container_hash
  microSummary?: string;
}
