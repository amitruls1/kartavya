import { spawn } from 'child_process';
import EventEmitter from 'events';
import path from 'path';

export class DockerSandbox extends EventEmitter {
  private containerId: string | null = null;

  constructor(private taskId: string, private projectDir: string) {
    super();
  }

  async provision(): Promise<string> {
    // Start a long-running docker container that mounts the project directory
    return new Promise((resolve, reject) => {
      const dockerProc = spawn('docker', [
        'run', '-d', '--name', `kartavya_agent_${this.taskId}`,
        '-v', `${this.projectDir}:/workspace`,
        '-w', '/workspace',
        'node:18-alpine',
        'tail', '-f', '/dev/null' // keep alive
      ]);

      let output = '';
      dockerProc.stdout.on('data', (data) => output += data.toString());
      
      dockerProc.on('close', (code) => {
        if (code === 0) {
          this.containerId = output.trim();
          resolve(this.containerId);
        } else {
          reject(new Error('Failed to provision docker sandbox'));
        }
      });
    });
  }

  async runCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    if (!this.containerId) throw new Error('Container not provisioned');
    
    return new Promise((resolve, reject) => {
      const proc = spawn('docker', ['exec', this.containerId!, 'sh', '-c', command]);
      
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        const text = data.toString();
        stdout += text;
        this.emit('stdout', text);
      });

      proc.stderr.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        this.emit('stderr', text);
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  async teardown(): Promise<void> {
    if (!this.containerId) return;
    
    return new Promise((resolve, reject) => {
      const proc = spawn('docker', ['rm', '-f', this.containerId!]);
      proc.on('close', (code) => {
        if (code === 0) {
          this.containerId = null;
          resolve();
        } else {
          reject(new Error('Failed to teardown docker sandbox'));
        }
      });
    });
  }
}
