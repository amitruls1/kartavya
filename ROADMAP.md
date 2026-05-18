# **Kartavya: Advanced Orchestration Framework Roadmap**

This document outlines the strategic evolution of Kartavya from its current MVP state to an enterprise-grade multi-agent engineering platform.

---

## **Phase 1: Foundation & MVP (Current Status)**
- [x] **Monorepo Scaffolding:** Next.js + Node.js + Shared Types.
- [x] **SCM Engine:** Local Markdown-based knowledge graph.
- [x] **Docker Sandboxing:** Basic container provisioning and command execution.
- [x] **TDD Loop:** Hardcoded 6-phase agent workflow with loop detection.
- [x] **PA DAG Generation:** Initial logic for requirement-to-task mapping.
- [x] **Dashboard UI:** Epic Workspace, DAG visualizer, and terminal streaming.

---

## **Phase 2: Intelligent Orchestration (Alpha - Q3 2026)**
*Goal: Move from hardcoded mocks to real-world LLM-driven reasoning.*

### **2.1 LLM Integration Layer**
- [ ] **Provider Multiplexing:** Support for Gemini Pro (context-heavy reasoning), Claude 3.5 Sonnet (coding precision), and local LLMs (Ollama).
- [ ] **Dynamic Tool Use:** Allow agents to decide which tool from the registry to call based on the task context.

### **2.2 Advanced DAG Logic**
- [ ] **Heuristic Cost Estimation:** Estimate token usage and time-to-completion before executing a DAG.
- [ ] **Adaptive Re-planning:** Enable the Principal Architect to modify the DAG mid-execution if a task failure requires a change in strategy.

### **2.3 Enhanced Sandboxing**
- [ ] **Snapshotting:** Save Docker container state after "Green Phase" success for instant recovery.
- [ ] **Resource Throttling:** Limit CPU/RAM usage per agent to prevent host system instability.

---

## **Phase 3: SCM & Knowledge Graph (Beta - Q4 2026)**
*Goal: Transform documentation into a living architectural memory.*

### **3.1 Vectorized SCM**
- [ ] **RAG Integration:** Move from Markdown search to a local Vector DB (Chromadb/Qdrant) for semantic code retrieval.
- [ ] **Auto-Documentation:** Agents automatically update `ARCHITECTURE.md` and `API_SPEC.md` upon task completion.

### **3.2 Regression Intelligence**
- [ ] **Dependency Mapping:** Use the SCM to alert agents when a new change might impact distant components identified in previous tasks.
- [ ] **Conflict Resolution:** SCM-driven mediation when parallel tasks attempt to modify the same file.

---

## **Phase 4: Ecosystem & Enterprise (v1.0 - 2027)**
*Goal: Scale Kartavya for team collaboration and production workflows.*

### **4.1 Team Collaboration**
- [ ] **Multi-User Dashboard:** Real-time collaboration on Epics with human-in-the-loop (HITL) checkpoints.
- [ ] **PR Automation:** Deep integration with GitHub/GitLab to handle review comments autonomously.

### **4.2 Skill Marketplace**
- [ ] **Custom Skill Registry:** Allow developers to define and share custom agent skills (e.g., "Postgres Optimizer", "Accessibility Auditor").
- [ ] **Plugin System:** Third-party observability integrations (LangSmith, Helicone).

### **4.3 Security & Compliance**
- [ ] **Secret Scrubbing:** Automatic detection and masking of API keys in terminal streams.
- [ ] **Audit Logs:** Immutable history of every tool call and agent decision for compliance.

---

## **Phase 5: Future Horizons (Beyond 1.0)**
- [ ] **Self-Improving Agents:** Agents that analyze their own failure patterns in the SCM to adjust their "Refactor Phase" strategies.
- [ ] **Hardware Acceleration:** Native integration with GPU clusters for complex local model inference during architecture phases.
