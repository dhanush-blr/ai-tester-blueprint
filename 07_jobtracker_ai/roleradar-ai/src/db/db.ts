// ============================================================
// src/db/db.ts — RoleRadar AI: IndexedDB Service Layer
// Uses: idb v8 | DB: roleradar-db v1 | Store: jobs
// ============================================================

import { openDB, type IDBPDatabase } from 'idb';
import type { JobEntry, DBExportPayload } from '../types';

const DB_NAME = 'roleradar-db';
const STORE_NAME = 'jobs';
const DB_VERSION = 1;

// Singleton DB connection
let _db: IDBPDatabase | null = null;

export async function initDB(): Promise<IDBPDatabase> {
  if (_db) return _db;

  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        // Indexes for efficient queries
        store.createIndex('by-status', 'status', { unique: false });
        store.createIndex('by-company', 'company', { unique: false });
        store.createIndex('by-dateApplied', 'dateApplied', { unique: false });
      }
    },
  });

  return _db;
}

// ---- READ ----

export async function getAllJobs(): Promise<JobEntry[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME) as Promise<JobEntry[]>;
}

export async function getJobById(id: number): Promise<JobEntry | undefined> {
  const db = await initDB();
  return db.get(STORE_NAME, id) as Promise<JobEntry | undefined>;
}

// ---- WRITE ----

export async function addJob(job: Omit<JobEntry, 'id'>): Promise<number> {
  const db = await initDB();
  const now = new Date().toISOString();
  const entry: Omit<JobEntry, 'id'> = {
    ...job,
    createdAt: job.createdAt || now,
    updatedAt: now,
  };
  const id = await db.add(STORE_NAME, entry);
  return id as number;
}

export async function updateJob(job: JobEntry): Promise<void> {
  if (job.id === undefined) throw new Error('Cannot update job without id');
  const db = await initDB();
  const updated: JobEntry = {
    ...job,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORE_NAME, updated);
}

export async function updateJobStatus(
  id: number,
  status: JobEntry['status']
): Promise<void> {
  const db = await initDB();
  const job = await db.get(STORE_NAME, id) as JobEntry | undefined;
  if (!job) throw new Error(`Job ${id} not found`);
  await db.put(STORE_NAME, {
    ...job,
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteJob(id: number): Promise<void> {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

// ---- BACKUP / RESTORE ----

export async function exportAllJobs(): Promise<void> {
  const jobs = await getAllJobs();
  const payload: DBExportPayload = {
    exportedAt: new Date().toISOString(),
    version: DB_VERSION,
    jobs,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `roleradar-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importJobs(file: File): Promise<{ imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  const text = await file.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return { imported: 0, errors: ['Invalid JSON file. Could not parse.'] };
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    !Array.isArray((payload as DBExportPayload).jobs)
  ) {
    return { imported: 0, errors: ['Invalid backup format. Expected { jobs: [...] }.'] };
  }

  const { jobs } = payload as DBExportPayload;

  for (const [i, raw] of jobs.entries()) {
    try {
      // Basic shape validation
      if (!raw.company || !raw.role || !raw.status) {
        errors.push(`Job #${i + 1}: missing required fields (company, role, status).`);
        continue;
      }
      // Strip id to let IndexedDB assign a new one
      const { id: _id, ...jobWithoutId } = raw as JobEntry;
      void _id; // suppress unused variable warning
      await addJob(jobWithoutId as Omit<JobEntry, 'id'>);
      imported++;
    } catch (err) {
      errors.push(`Job #${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { imported, errors };
}
