import fs from 'fs-extra';
import path from 'path';
import { Epic, Task, EpicStatus } from '@kartavya/shared';

const MEMORY_DIR = path.join(process.cwd(), '.kartavya', 'memory');
const EPICS_PATH = path.join(MEMORY_DIR, 'epics.json');

export class Store {
  private static epics: Epic[] = [];

  static async init() {
    await fs.ensureDir(MEMORY_DIR);
    if (await fs.pathExists(EPICS_PATH)) {
      this.epics = await fs.readJson(EPICS_PATH);
    } else {
      await fs.writeJson(EPICS_PATH, []);
    }
  }

  static async saveEpic(epic: Epic) {
    this.epics.push(epic);
    await fs.writeJson(EPICS_PATH, this.epics);
  }

  static getEpics(): Epic[] {
    return this.epics;
  }

  static getEpic(id: string): Epic | undefined {
    return this.epics.find(e => e.id === id);
  }
}
