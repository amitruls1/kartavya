export declare enum EpicStatus {
    DRAFT = "DRAFT",
    ARCHITECTING = "ARCHITECTING",
    EXECUTING = "EXECUTING",
    REVIEW = "REVIEW",
    DONE = "DONE"
}
export declare enum TaskStatus {
    PENDING = "PENDING",
    WRITING_SPECS = "WRITING_SPECS",
    IMPLEMENTING = "IMPLEMENTING",
    TESTING = "TESTING",
    DONE = "DONE"
}
export declare enum AgentPersona {
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
    dependencyGraph: any;
    summaries_summary: string;
}
export interface Task {
    id: string;
    epicId: string | null;
    assignedPersona: AgentPersona;
    acceptanceCriteria: string[];
    status: TaskStatus;
    containerId?: string;
    microSummary?: string;
}
