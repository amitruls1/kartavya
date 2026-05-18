import { DaemonClient, ProjectMemory } from '../src/scm';
import fs from 'fs-extra';
import path from 'path';

describe("Shared Context Memory (SCM) Engine", () => {
  beforeAll(async () => {
    // Ensure memory dir is clean before test
    const memoryDir = path.join(process.cwd(), '.kartavya', 'memory');
    await fs.remove(memoryDir);
  });

  it("should merge a task's micro-summary into global SCM on completion", async () => {
    const project = { id: "proj_1" };
    const task = { id: "task_101" };
      
    const agentSummary = {
      changes: "Initialized Redis connection pool client.",
      componentsAdded: ["/src/infra/redis.ts"],
      specsPassed: ["spec_redis_connection_success"]
    };

    await DaemonClient.purgeTaskContext(task.id, agentSummary);
      
    const updatedSCM = await ProjectMemory.getGlobalContext(project.id);
    expect(updatedSCM).toContain("/src/infra/redis.ts");
    expect(updatedSCM).toContain("Initialized Redis connection pool client.");
  });
});
