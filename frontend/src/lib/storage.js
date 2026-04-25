

const STORAGE_KEYS = {
  QUESTIONS: 'algonexus_questions',
  TOPICS: 'algonexus_topics',
  NOTES: 'algonexus_notes',
  NOTE_FOLDERS: 'algonexus_note_folders',
  ROADMAPS: 'algonexus_roadmaps'
};

export const localStore = {
  // Generic getters/setters
  get: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Questions
  getQuestions: () => localStore.get(STORAGE_KEYS.QUESTIONS),
  saveQuestion: (question) => {
    const questions = localStore.getQuestions();
    const newQuestion = {
      ...question,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    localStore.set(STORAGE_KEYS.QUESTIONS, [...questions, newQuestion]);
    return newQuestion;
  },
  updateQuestion: (id, updates) => {
    const questions = localStore.getQuestions();
    const updated = questions.map((q) => q.id === id ? { ...q, ...updates } : q);
    localStore.set(STORAGE_KEYS.QUESTIONS, updated);
  },
  deleteQuestion: (id) => {
    const questions = localStore.getQuestions();
    localStore.set(STORAGE_KEYS.QUESTIONS, questions.filter((q) => q.id !== id));
  },

  // Topics (Folders for Problems)
  getTopics: () => localStore.get(STORAGE_KEYS.TOPICS),
  saveTopic: (topic) => {
    const topics = localStore.getTopics();
    const newTopic = { ...topic, id: crypto.randomUUID() };
    localStore.set(STORAGE_KEYS.TOPICS, [...topics, newTopic]);
    return newTopic;
  },
  updateTopic: (id, updates) => {
    const topics = localStore.getTopics();
    const updated = topics.map((t) => t.id === id ? { ...t, ...updates } : t);
    localStore.set(STORAGE_KEYS.TOPICS, updated);
  },
  deleteTopic: (id) => {
    const topics = localStore.getTopics();
    localStore.set(STORAGE_KEYS.TOPICS, topics.filter((t) => t.id !== id));
    // Also delete questions in this topic
    const questions = localStore.getQuestions();
    localStore.set(STORAGE_KEYS.QUESTIONS, questions.filter((q) => q.topicId !== id));
  },

  // Notes
  getNotes: () => localStore.get(STORAGE_KEYS.NOTES),
  saveNote: (note) => {
    const notes = localStore.getNotes();
    const newNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    localStore.set(STORAGE_KEYS.NOTES, [...notes, newNote]);
    return newNote;
  },
  updateNote: (id, updates) => {
    const notes = localStore.getNotes();
    const updated = notes.map((n) => n.id === id ? { ...n, ...updates } : n);
    localStore.set(STORAGE_KEYS.NOTES, updated);
  },
  deleteNote: (id) => {
    const notes = localStore.getNotes();
    localStore.set(STORAGE_KEYS.NOTES, notes.filter((n) => n.id !== id));
  },

  // Note Folders
  getNoteFolders: () => localStore.get(STORAGE_KEYS.NOTE_FOLDERS),
  saveNoteFolder: (folder) => {
    const folders = localStore.getNoteFolders();
    const newFolder = { ...folder, id: crypto.randomUUID() };
    localStore.set(STORAGE_KEYS.NOTE_FOLDERS, [...folders, newFolder]);
    return newFolder;
  },
  updateNoteFolder: (id, updates) => {
    const folders = localStore.getNoteFolders();
    const updated = folders.map((f) => f.id === id ? { ...f, ...updates } : f);
    localStore.set(STORAGE_KEYS.NOTE_FOLDERS, updated);
  },
  deleteNoteFolder: (id) => {
    const folders = localStore.getNoteFolders();
    localStore.set(STORAGE_KEYS.NOTE_FOLDERS, folders.filter((f) => f.id !== id));
    // Also delete notes in this folder
    const notes = localStore.getNotes();
    localStore.set(STORAGE_KEYS.NOTES, notes.filter((n) => n.folderId !== id));
  },

  // Roadmaps
  getRoadmaps: () => localStore.get(STORAGE_KEYS.ROADMAPS),
  saveRoadmap: (roadmap) => {
    const roadmaps = localStore.getRoadmaps();
    const newRoadmap = {
      ...roadmap,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    localStore.set(STORAGE_KEYS.ROADMAPS, [...roadmaps, newRoadmap]);
    return newRoadmap;
  },
  updateRoadmap: (id, updates) => {
    const roadmaps = localStore.getRoadmaps();
    const updated = roadmaps.map((r) => r.id === id ? { ...r, ...updates } : r);
    localStore.set(STORAGE_KEYS.ROADMAPS, updated);
  },
  deleteRoadmap: (id) => {
    const roadmaps = localStore.getRoadmaps();
    localStore.set(STORAGE_KEYS.ROADMAPS, roadmaps.filter((r) => r.id !== id));
  },

  // Sync Code (Export/Import)
  exportData: () => {
    const data = {
      questions: localStore.getQuestions(),
      topics: localStore.getTopics(),
      notes: localStore.getNotes(),
      noteFolders: localStore.getNoteFolders(),
      roadmaps: localStore.getRoadmaps(),
      version: '1.0',
      exportedAt: new Date().toISOString()
    };
    return btoa(JSON.stringify(data));
  },
  importData: (code) => {
    try {
      const data = JSON.parse(atob(code));
      if (data.questions) localStore.set(STORAGE_KEYS.QUESTIONS, data.questions);
      if (data.topics) localStore.set(STORAGE_KEYS.TOPICS, data.topics);
      if (data.notes) localStore.set(STORAGE_KEYS.NOTES, data.notes);
      if (data.noteFolders) localStore.set(STORAGE_KEYS.NOTE_FOLDERS, data.noteFolders);
      if (data.roadmaps) localStore.set(STORAGE_KEYS.ROADMAPS, data.roadmaps);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }
};