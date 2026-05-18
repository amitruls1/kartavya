import { AgentFactory, PrincipalArchitectAgent } from '../src/pa';
import { AgentPersona } from '@kartavya/shared';

describe("Principal Architect Orchestrator", () => {
  it("should parse an epic requirement document and output a valid parallelized task array", async () => {
    const epicReq = "Build a user login interface with email validation and a dashboard landing view.";
    const paAgent = await AgentFactory.spawn(AgentPersona.PRINCIPAL_ARCHITECT) as PrincipalArchitectAgent;
      
    const planningOutput = await paAgent.analyzeRequirements(epicReq);
      
    expect(planningOutput.tasks.length).toBeGreaterThan(1);
    expect(planningOutput.tasks[0]).toHaveProperty("assignedPersona"); // Match our interface casing
    expect(planningOutput.tasks[0]).toHaveProperty("acceptanceCriteria");
    // Ensure parallelization logic works (e.g. UX can start concurrently with Backend)
    expect(planningOutput.dependencyGraph).toBeDefined();
  });
});
