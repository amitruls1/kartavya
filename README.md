# **Kartavya (Advanced Orchestration Framework)**

**Kartavya** is a sophisticated, spec-driven multi-agent engineering platform designed to treat AI coding agents as autonomous, stateful engineering teammates. It provides a robust control plane (Web Dashboard) and an execution plane (Local Daemon + Ephemeral Docker Workspaces) to guarantee safety, observability, and deterministic outputs.

---

## **🚀 Key Features**

- **Shared Context Memory (SCM):** A project-wide knowledge graph that prevents agents from operating in silos. Every completed task updates a global ledger, ensuring subsequent agents have full context.
- **Docker Sandboxing:** Agents execute in isolated, ephemeral Docker containers. This ensures a consistent environment and protects your host machine.
- **Strict TDD Protocol:** Agents follow a hardcoded 6-phase workflow:
    1. **Hydration:** Syncing with the global SCM.
    2. **Spec Phase:** Writing tests based on acceptance criteria.
    3. **Red Phase:** Validating that tests fail (TDD requirement).
    4. **Green Phase:** Implementing the solution.
    5. **Refactor Phase:** Verifying tests pass.
    6. **Commit & Purge:** Committing changes and updating the SCM.
- **Principal Architect (PA):** Intelligent DAG generation that breaks down high-level Epics into parallelized and sequential tasks.
- **Live Observability:** A Next.js dashboard that streams terminal output (stdout/stderr) from Docker sandboxes in real-time.
- **Infinite Loop Protection:** Automatic intervention if an agent attempts to fix a failing test more than 5 times without success.

---

## **🏗️ Architecture**

The project is structured as a monorepo using **npm workspaces**:

- **`/frontend`**: A Next.js 15+ dashboard for monitoring Epics and Tasks.
- **`/daemon`**: A Node.js TypeScript daemon responsible for Docker orchestration, tool execution, and the SCM engine.
- **`/packages/shared`**: Shared types and schemas used by both the frontend and the daemon.

---

## **🚦 Getting Started**

### **Prerequisites**
- Node.js 18+
- Docker (running)
- Git

### **Installation**
1. Clone the repository:
   ```bash
   git clone git@github.com:amitruls1/kartavya.git
   cd kartavya
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the shared package:
   ```bash
   npm run build -w @kartavya/shared
   ```

### **Running the Platform**
1. **Start the Daemon:**
   ```bash
   cd daemon
   npm run dev
   ```
2. **Start the Dashboard:**
   ```bash
   cd frontend
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the Epic Workspace.

---

## **🧪 Testing**
To run the core verification tests for the SCM and PA logic:
```bash
cd daemon
npx jest
```

---

## **🗺️ Roadmap**
Detailed future development plans can be found in [ROADMAP.md](./ROADMAP.md).

---

## **📄 License**
ISC
