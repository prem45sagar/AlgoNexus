import axios from 'axios';
import { dbOperations } from './db';

const api = axios.create({
  baseURL: '/api'
});

export const localStore = {
  // Scraper still needs the server
  importProblem: async (url) => {
    const res = await api.post('/import-problem', { url });
    return res.data;
  },

  // --- Questions ---
  getQuestions: async () => {
    return await dbOperations.getAll('questions');
  },
  saveQuestion: async (q) => {
    return await dbOperations.add('questions', q);
  },
  updateQuestion: async (id, q) => {
    const existing = await dbOperations.getById('questions', id);
    return await dbOperations.put('questions', { ...existing, ...q });
  },
  deleteQuestion: async (id) => {
    return await dbOperations.delete('questions', id);
  },

  // --- Topics ---
  getTopics: async () => {
    return await dbOperations.getAll('topics');
  },
  saveTopic: async (t) => {
    return await dbOperations.add('topics', t);
  },
  updateTopic: async (id, t) => {
    const existing = await dbOperations.getById('topics', id);
    return await dbOperations.put('topics', { ...existing, ...t });
  },
  deleteTopic: async (id) => {
    await dbOperations.delete('topics', id);
    // Cascade delete questions
    const questions = await dbOperations.getAll('questions');
    const toDelete = questions.filter(q => q.topicId === id);
    await Promise.all(toDelete.map(q => dbOperations.delete('questions', q.id)));
  },

  // --- Notes ---
  getNotes: async () => {
    return await dbOperations.getAll('notes');
  },
  saveNote: async (n) => {
    return await dbOperations.add('notes', n);
  },
  updateNote: async (id, n) => {
    const existing = await dbOperations.getById('notes', id);
    return await dbOperations.put('notes', { ...existing, ...n });
  },
  deleteNote: async (id) => {
    return await dbOperations.delete('notes', id);
  },

  // --- Note Folders ---
  getNoteFolders: async () => {
    return await dbOperations.getAll('noteFolders');
  },
  saveNoteFolder: async (f) => {
    return await dbOperations.add('noteFolders', f);
  },
  updateNoteFolder: async (id, f) => {
    const existing = await dbOperations.getById('noteFolders', id);
    return await dbOperations.put('noteFolders', { ...existing, ...f });
  },
  deleteNoteFolder: async (id) => {
    await dbOperations.delete('noteFolders', id);
    // Cascade delete notes
    const notes = await dbOperations.getAll('notes');
    const toDelete = notes.filter(n => n.folderId === id);
    await Promise.all(toDelete.map(n => dbOperations.delete('notes', n.id)));
  },

  // --- Roadmaps ---
  getRoadmaps: async () => {
    return await dbOperations.getAll('roadmaps');
  },
  saveRoadmap: async (r) => {
    return await dbOperations.add('roadmaps', r);
  },
  updateRoadmap: async (id, r) => {
    const existing = await dbOperations.getById('roadmaps', id);
    return await dbOperations.put('roadmaps', { ...existing, ...r });
  },
  deleteRoadmap: async (id) => {
    return await dbOperations.delete('roadmaps', id);
  },

  // --- Sync & Backup (Portable System) ---
  exportData: async () => {
    const [questions, topics, notes, noteFolders, roadmaps] = await Promise.all([
      dbOperations.getAll('questions'),
      dbOperations.getAll('topics'),
      dbOperations.getAll('notes'),
      dbOperations.getAll('noteFolders'),
      dbOperations.getAll('roadmaps')
    ]);
    
    const data = {
      questions,
      topics,
      notes,
      noteFolders,
      roadmaps,
      version: '2.0-local',
      exportedAt: new Date().toISOString()
    };
    
    // Convert to Base64 for easy copying
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  },

  importData: async (code) => {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(code))));
      
      // Clear existing stores
      await Promise.all([
        dbOperations.clearAll('questions'),
        dbOperations.clearAll('topics'),
        dbOperations.clearAll('notes'),
        dbOperations.clearAll('noteFolders'),
        dbOperations.clearAll('roadmaps')
      ]);

      // Batch import
      const importers = [];
      if (data.questions) data.questions.forEach(q => importers.push(dbOperations.put('questions', q)));
      if (data.topics) data.topics.forEach(t => importers.push(dbOperations.put('topics', t)));
      if (data.notes) data.notes.forEach(n => importers.push(dbOperations.put('notes', n)));
      if (data.noteFolders) data.noteFolders.forEach(f => importers.push(dbOperations.put('noteFolders', f)));
      if (data.roadmaps) data.roadmaps.forEach(r => importers.push(dbOperations.put('roadmaps', r)));
      
      await Promise.all(importers);
      return true;
    } catch(e) {
      console.error('Import failed:', e);
      return false;
    }
  }
};
