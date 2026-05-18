import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ProjectMemory } from './scm';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Kartavya Daemon is running');
});

io.on('connection', (socket) => {
  console.log('Client connected to Kartavya Daemon');
  
  socket.on('start-task', async (data) => {
    console.log('Starting task:', data);
    // Here we would instantiate AgentExecutionLoop and pipe output to socket
    socket.emit('output', { type: 'stdout', data: 'Initializing Docker sandbox...' });
    setTimeout(() => {
      socket.emit('output', { type: 'stdout', data: 'Hydrating agent with SCM context...' });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

async function start() {
  await ProjectMemory.init();
  httpServer.listen(PORT, () => {
    console.log(`🚀 Kartavya Daemon listening on port ${PORT}`);
  });
}

start();
