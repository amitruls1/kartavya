import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ProjectMemory } from './scm';
import { Store } from './store';
import { AgentFactory } from './pa';
import { EpicStatus, AgentPersona } from '@kartavya/shared';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

// REST Endpoints
app.get('/epics', (req, res) => {
  res.json(Store.getEpics());
});

app.post('/epics', async (req, res) => {
  const { title, requirements } = req.body;
  const pa = await AgentFactory.spawn(AgentPersona.PRINCIPAL_ARCHITECT);
  const plan = await pa.analyzeRequirements(requirements);

  const newEpic = {
    id: uuidv4(),
    projectId: 'default',
    title,
    requirements,
    status: EpicStatus.ARCHITECTING,
    dependencyGraph: plan.dependencyGraph,
    summaries_summary: 'Architecting dependency graph...',
    tasks: plan.tasks // We'll add this to the shared type in a moment or handle separately
  };

  await Store.saveEpic(newEpic as any);
  io.emit('epic-created', newEpic);
  res.json(newEpic);
});

io.on('connection', (socket) => {
  console.log('Client connected to Kartavya Daemon');
  
  socket.on('start-task', async (data) => {
    socket.emit('output', { type: 'stdout', data: `Starting task ${data.taskId}...` });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

async function start() {
  await Store.init();
  await ProjectMemory.init();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Kartavya Daemon listening on port ${PORT}`);
  });
}

start();
