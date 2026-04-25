import React, { useState, useEffect } from 'react';

import { localStore } from '../lib/api';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Trash2, Folder, FileCode2, ExternalLink, Eye, ArrowLeft, Copy, Check, GripVertical, Edit2, Settings, Download, Loader2, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import ConfirmModal from '../components/ConfirmModal';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { IconPicker, getIconComponent } from '../lib/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAppStore } from '../lib/store';
import { toast } from 'sonner';import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";



const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'sql'];

const PROBLEM_TEMPLATE = `# Intuition
<!-- Describe your first thoughts on how to solve this problem. -->

# Approach
<!-- Describe your approach to solving the problem. -->

# Complexity
- Time complexity:
<!-- Add your time complexity here, e.g. $$O(n)$$ -->

- Space complexity:
<!-- Add your space complexity here, e.g. $$O(n)$$ -->
`;

const getLanguageExtension = (lang) => {
  switch (lang) {
    case 'javascript':
    case 'typescript':
      return [javascript({ jsx: true, typescript: lang === 'typescript' })];
    case 'python':
      return [python()];
    case 'java':
      return [java()];
    case 'c':
    case 'cpp':
      return [cpp()];
    case 'go':
      return [go()];
    case 'rust':
      return [rust()];
    case 'sql':
      return [sql()];
    default:
      return [javascript()];
  }
};

const CodeBlock = ({ code, language: initialLanguage = 'javascript' }) => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (/*#__PURE__*/
    _jsxs("div", { className: "rounded-lg border border-slate-700/50 overflow-hidden bg-[#0f172a]", children: [/*#__PURE__*/
      _jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50", children: [/*#__PURE__*/
        _jsxs("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsx(Settings, { className: "h-3.5 w-3.5 text-slate-500" }), /*#__PURE__*/
          _jsx("select", {
            value: language,
            onChange: (e) => setLanguage(e.target.value),
            className: "bg-transparent text-xs text-slate-400 focus:outline-none cursor-pointer", children:

            LANGUAGES.map((lang) => /*#__PURE__*/
            _jsx("option", { value: lang, className: "bg-slate-800", children: lang }, lang)
            ) }
          )] }
        ), /*#__PURE__*/
        _jsxs("button", {
          onClick: handleCopy,
          className: "flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors", children: [

          copied ? /*#__PURE__*/_jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /*#__PURE__*/_jsx(Copy, { className: "h-3.5 w-3.5" }),
          copied ? 'Copied!' : 'Copy'] }
        )] }
      ), /*#__PURE__*/
      _jsx(CodeMirror, {
        value: code,
        height: "auto",
        theme: vscodeDark,
        extensions: getLanguageExtension(language),
        editable: false,
        basicSetup: {
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: false
        },
        className: "text-sm" }
      )] }
    ));

};

export default function Problems() {
  const { activeFolderId, setActiveFolderId } = useAppStore();

  const [view, setView] = useState('list');
  const [viewingProblem, setViewingProblem] = useState(null);
  const [isEditingView, setIsEditingView] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editApproach, setEditApproach] = useState('');
  const [editLanguage, setEditLanguage] = useState('javascript');
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [folderName, setFolderName] = useState('');
  const [folderIcon, setFolderIcon] = useState('Folder');
  const [editingFolder, setEditingFolder] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    topicId: '',
    title: '',
    link: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    status: 'To Do',
    description: '',
    approach: PROBLEM_TEMPLATE,
    notes: PROBLEM_TEMPLATE,
    code: '',
    language: 'javascript'
  });

  const handleImportProblem = async () => {
    if (!newQuestion.link) {
      setError('Please enter a problem URL first.');
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const response = await fetch('/api/import-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newQuestion.link })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import problem');
      }

      setNewQuestion((prev) => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        difficulty: data.difficulty === 'Easy' || data.difficulty === 'Medium' || data.difficulty === 'Hard' ? data.difficulty : prev.difficulty,
        platform: data.platform || 'LeetCode'
      }));
      toast.success('Problem data imported successfully');
    } catch (err) {
      console.error('Import error:', err);
      toast.error(err.message || 'Failed to import problem data');
      setError(err.message || 'Failed to import problem data. Please try again or enter manually.');
    } finally {
      setIsImporting(false);
    }
  };

  const [deleteModal, setDeleteModal] = useState(





    {
      isOpen: false,
      type: null,
      id: null,
      title: '',
      message: ''
    });

  useEffect(() => {
    const loadData = async () => {
      setTopics(await localStore.getTopics());
      setQuestions(await localStore.getQuestions());
      setLoading(false);
    };
    loadData();
  }, []);

  const refreshData = async () => {
    setTopics(await localStore.getTopics());
    setQuestions(await localStore.getQuestions());
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    if (topics.some((t) => t.name.toLowerCase() === folderName.trim().toLowerCase())) {
      setError('A folder with this name already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.saveTopic({
        name: folderName.trim(),
        icon: folderIcon,
        order: topics.length + 1
      });
      setFolderName('');
      setFolderIcon('Folder');
      setView('list');
      refreshData();
      toast.success('Folder created successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create folder');
    }
  };

  const handleEditFolderSubmit = async (e) => {
    e.preventDefault();
    if (!editingFolder || !editingFolder.name.trim()) return;

    if (topics.some((t) => t.id !== editingFolder.id && t.name.toLowerCase() === editingFolder.name.trim().toLowerCase())) {
      setError('A folder with this name already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.updateTopic(editingFolder.id, {
        name: editingFolder.name.trim(),
        icon: editingFolder.icon
      });
      setEditingFolder(null);
      setView('list');
      refreshData();
      toast.success('Folder updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update folder');
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!newQuestion.topicId || !newQuestion.title.trim()) return;

    if (questions.some((q) => q.title.toLowerCase() === newQuestion.title.trim().toLowerCase())) {
      setError('A problem with this title already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.saveQuestion({
        ...newQuestion,
        title: newQuestion.title.trim(),
        order: questions.length + 1
      });
      setNewQuestion({
        topicId: '',
        title: '',
        link: '',
        platform: 'LeetCode',
        difficulty: 'Medium',
        status: 'To Do',
        description: '',
        approach: PROBLEM_TEMPLATE,
        notes: PROBLEM_TEMPLATE,
        code: '',
        language: 'javascript'
      });
      setView('list');
      refreshData();
      toast.success('Problem added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add problem');
    }
  };

  const confirmDeleteTopic = (id) => {
    setDeleteModal({
      isOpen: true,
      type: 'topic',
      id,
      title: 'Delete Folder',
      message: 'Are you sure you want to delete this folder? All problems inside will remain but lose their folder association unless deleted separately.'
    });
  };

  const confirmDeleteQuestion = (id) => {
    setDeleteModal({
      isOpen: true,
      type: 'question',
      id,
      title: 'Delete Problem',
      message: 'Are you sure you want to delete this problem? This action cannot be undone.'
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      if (deleteModal.type === 'topic') {
        await localStore.deleteTopic(deleteModal.id);
        if (activeFolderId === deleteModal.id) setActiveFolderId(null);
        toast.success('Folder deleted');
      } else if (deleteModal.type === 'question') {
        await localStore.deleteQuestion(deleteModal.id);
        toast.success('Problem deleted');
      }
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete');
    }
  };

  const updateProblemStatus = async (problemId, newStatus) => {
    try {
      await localStore.updateQuestion(problemId, { status: newStatus });
      if (viewingProblem && viewingProblem.id === problemId) {
        setViewingProblem({ ...viewingProblem, status: newStatus });
      }
      refreshData();
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleStartEditing = () => {
    if (!viewingProblem) return;
    setEditTitle(viewingProblem.title || '');
    setEditDescription(viewingProblem.description || '');
    setEditCode(viewingProblem.code || '');
    setEditApproach(viewingProblem.approach || viewingProblem.notes || '');
    setEditLanguage(viewingProblem.language || 'javascript');
    setIsEditingView(true);
  };

  const handleSaveProblem = async () => {
    if (!viewingProblem) return;
    try {
      await localStore.updateQuestion(viewingProblem.id, {
        title: editTitle,
        description: editDescription,
        code: editCode,
        approach: editApproach,
        language: editLanguage
      });
      setViewingProblem({
        ...viewingProblem,
        title: editTitle,
        description: editDescription,
        code: editCode,
        approach: editApproach,
        language: editLanguage
      });
      setIsEditingView(false);
      refreshData();
      toast.success('Problem updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update problem');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newTopics = Array.from(topics);
    const [reorderedItem] = newTopics.splice(sourceIndex, 1);
    newTopics.splice(destinationIndex, 0, reorderedItem);

    setTopics(newTopics);

    // Update order in local storage
    try {
      await Promise.all(newTopics.map((topic, index) => 
        localStore.updateTopic(topic.id, { order: index + 1 })
      ));
      toast.success('Folder order updated');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  return (/*#__PURE__*/
    _jsxs("div", { className: "max-w-[1440px] mx-auto space-y-8 px-4", children: [/*#__PURE__*/
      _jsx(ConfirmModal, {
        isOpen: deleteModal.isOpen,
        title: deleteModal.title,
        message: deleteModal.message,
        onConfirm: handleConfirmDelete,
        onCancel: () => setDeleteModal((prev) => ({ ...prev, isOpen: false })) }
      ), /*#__PURE__*/


      _jsxs("header", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsx("h1", { className: "text-3xl font-bold text-text-main", children: "Problems" }), /*#__PURE__*/
        _jsx("div", { className: "flex gap-3", children:
          view === 'view-problem' ? /*#__PURE__*/
          _jsxs("button", { onClick: () => {setView('list');setViewingProblem(null);}, className: "px-4 py-2 flex items-center gap-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-medium text-sm", children: [/*#__PURE__*/
            _jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to List"] }
          ) : /*#__PURE__*/

          _jsx(_Fragment, { children:
            view === 'new-folder' ? /*#__PURE__*/
            _jsx("button", { onClick: () => {setView('list');setError(null);}, className: "px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-medium text-sm", children: "Cancel" }

            ) : /*#__PURE__*/

            _jsx("button", { onClick: () => {setView('new-folder');setError(null);}, className: "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm", children: "+ New Folder" }

            ) }

          ) }

        )] }
      ),


      view === 'new-folder' && /*#__PURE__*/
      _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-4", children: [
        error && /*#__PURE__*/
        _jsx("div", { className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm", children:
          error }
        ), /*#__PURE__*/

        _jsxs("form", { onSubmit: handleCreateFolder, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Folder Name *" }), /*#__PURE__*/
            _jsx("input", {
              type: "text",
              placeholder: "e.g., Arrays, Two Pointers, Sliding Window",
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
              value: folderName,
              onChange: (e) => setFolderName(e.target.value),
              required: true }
            )] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Folder Icon" }), /*#__PURE__*/
            _jsx(IconPicker, { selected: folderIcon, onSelect: setFolderIcon })] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "flex gap-3", children: [/*#__PURE__*/
            _jsx("button", { type: "submit", className: "px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium", children: "Create Folder" }

            ), /*#__PURE__*/
            _jsx("button", { type: "button", onClick: () => setView('list'), className: "px-6 py-2.5 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-main transition-colors font-medium", children: "Cancel" }

            )] }
          )] }
        )] }
      ),



      view === 'edit-folder' && editingFolder && /*#__PURE__*/
      _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-4", children: [
        error && /*#__PURE__*/
        _jsx("div", { className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm", children:
          error }
        ), /*#__PURE__*/

        _jsxs("form", { onSubmit: handleEditFolderSubmit, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Folder Name *" }), /*#__PURE__*/
            _jsx("input", {
              type: "text",
              placeholder: "e.g., Arrays, Two Pointers, Sliding Window",
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
              value: editingFolder.name,
              onChange: (e) => setEditingFolder({ ...editingFolder, name: e.target.value }),
              required: true }
            )] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Folder Icon" }), /*#__PURE__*/
            _jsx(IconPicker, { selected: editingFolder.icon, onSelect: (icon) => setEditingFolder({ ...editingFolder, icon }) })] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "flex gap-3", children: [/*#__PURE__*/
            _jsx("button", { type: "submit", className: "px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium", children: "Save Changes" }

            ), /*#__PURE__*/
            _jsx("button", { type: "button", onClick: () => {setView('list');setEditingFolder(null);}, className: "px-6 py-2.5 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-main transition-colors font-medium", children: "Cancel" }

            )] }
          )] }
        )] }
      ),



      view === 'new-problem' && /*#__PURE__*/
      _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-4", children: [
        error && /*#__PURE__*/
        _jsx("div", { className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm", children:
          error }
        ), /*#__PURE__*/

        _jsxs("form", { onSubmit: handleAddProblem, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Select Folder *" }), /*#__PURE__*/
            _jsxs("select", {
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors appearance-none",
              value: newQuestion.topicId,
              onChange: (e) => setNewQuestion({ ...newQuestion, topicId: e.target.value }),
              required: true, children: [/*#__PURE__*/

              _jsx("option", { value: "", disabled: true, children: "Select a folder..." }),
              topics.map((t) => /*#__PURE__*/
              _jsx("option", { value: t.id, children: t.name }, t.id)
              )] }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [/*#__PURE__*/
            _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Problem Title *" }), /*#__PURE__*/
              _jsx("input", {
                type: "text",
                placeholder: "e.g., Two Sum",
                className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
                value: newQuestion.title,
                onChange: (e) => setNewQuestion({ ...newQuestion, title: e.target.value }),
                required: true }
              )] }
            ), /*#__PURE__*/
            _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Link" }), /*#__PURE__*/
              _jsxs("div", { className: "flex gap-2", children: [/*#__PURE__*/
                _jsx("input", {
                  type: "url",
                  placeholder: "LeetCode, GeeksforGeeks, Codeforces URL...",
                  className: "flex-1 bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
                  value: newQuestion.link,
                  onChange: (e) => setNewQuestion({ ...newQuestion, link: e.target.value }) }
                ), /*#__PURE__*/
                _jsxs("button", {
                  type: "button",
                  onClick: handleImportProblem,
                  disabled: isImporting || !newQuestion.link,
                  className: "px-4 py-3 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap", children: [

                  isImporting ? /*#__PURE__*/_jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /*#__PURE__*/_jsx(Download, { className: "h-4 w-4" }),
                  isImporting ? 'Importing...' : 'Auto-Import'] }
                )] }
              )] }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [/*#__PURE__*/
            _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Platform" }), /*#__PURE__*/
              _jsxs("select", {
                className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors appearance-none",
                value: newQuestion.platform,
                onChange: (e) => setNewQuestion({ ...newQuestion, platform: e.target.value }), children: [/*#__PURE__*/

                _jsx("option", { value: "LeetCode", children: "LeetCode" }), /*#__PURE__*/
                _jsx("option", { value: "HackerRank", children: "HackerRank" }), /*#__PURE__*/
                _jsx("option", { value: "Codeforces", children: "Codeforces" }), /*#__PURE__*/
                _jsx("option", { value: "Other", children: "Other" })] }
              )] }
            ), /*#__PURE__*/
            _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Difficulty" }), /*#__PURE__*/
              _jsxs("select", {
                className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors appearance-none",
                value: newQuestion.difficulty,
                onChange: (e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value }), children: [/*#__PURE__*/

                _jsx("option", { value: "Easy", children: "Easy" }), /*#__PURE__*/
                _jsx("option", { value: "Medium", children: "Medium" }), /*#__PURE__*/
                _jsx("option", { value: "Hard", children: "Hard" })] }
              )] }
            ), /*#__PURE__*/
            _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Status" }), /*#__PURE__*/
              _jsxs("select", {
                className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors appearance-none",
                value: newQuestion.status,
                onChange: (e) => setNewQuestion({ ...newQuestion, status: e.target.value }), children: [/*#__PURE__*/

                _jsx("option", { value: "To Do", children: "To Do" }), /*#__PURE__*/
                _jsx("option", { value: "Solved", children: "Solved" }), /*#__PURE__*/
                _jsx("option", { value: "Revised", children: "Revised" })] }
              )] }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Problem Statement (Markdown Supported)" }), /*#__PURE__*/
            _jsx(MarkdownEditor, {
              value: newQuestion.description || '',
              onChange: (value) => setNewQuestion({ ...newQuestion, description: value }),
              placeholder: "Paste the problem description here...",
              minHeight: "600px",
              showTemplateButton: false }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Approach / Notes (Markdown Supported)" }), /*#__PURE__*/
            _jsx(MarkdownEditor, {
              value: newQuestion.approach || newQuestion.notes,
              onChange: (value) => setNewQuestion({ ...newQuestion, approach: value, notes: value }),
              placeholder: "Approach, key insights, or hints...",
              minHeight: "500px",
              showTemplateButton: false }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Solution Code" }), /*#__PURE__*/
              _jsx("select", {
                className: "bg-bg-surface text-xs text-text-muted rounded px-2 py-1 focus:outline-none border border-border-main",
                value: newQuestion.language,
                onChange: (e) => setNewQuestion({ ...newQuestion, language: e.target.value }), children:

                LANGUAGES.map((lang) => /*#__PURE__*/
                _jsx("option", { value: lang, children: lang }, lang)
                ) }
              )] }
            ), /*#__PURE__*/
            _jsx("div", { className: "rounded-lg border border-slate-700 overflow-hidden", children: /*#__PURE__*/
              _jsx(CodeMirror, {
                value: newQuestion.code,
                height: "300px",
                theme: vscodeDark,
                extensions: getLanguageExtension(newQuestion.language || 'javascript'),
                onChange: (value) => setNewQuestion({ ...newQuestion, code: value }),
                basicSetup: {
                  lineNumbers: true,
                  autocompletion: true,
                  foldGutter: true,
                  highlightActiveLine: true
                },
                className: "text-sm" }
              ) }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "flex gap-3", children: [/*#__PURE__*/
            _jsx("button", { type: "submit", className: "px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium", children: "Add Problem" }

            ), /*#__PURE__*/
            _jsx("button", { type: "button", onClick: () => setView('list'), className: "px-6 py-2.5 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-main transition-colors font-medium", children: "Cancel" }

            )] }
          )] }
        )] }
      ),



      view === 'view-problem' && viewingProblem && /*#__PURE__*/
      _jsxs("div", { className: "space-y-6", children: [/*#__PURE__*/

        _jsx("div", { className: "bg-[#1e293b] border border-slate-700 rounded-xl p-6 shadow-xl", children: /*#__PURE__*/
          _jsxs("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex-1 min-w-0", children: [
              isEditingView ? /*#__PURE__*/
              _jsx("input", {
                type: "text",
                className: "w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2 text-2xl font-bold text-white focus:outline-none focus:border-blue-500 mb-2",
                value: editTitle,
                onChange: (e) => setEditTitle(e.target.value) }
              ) : /*#__PURE__*/

              _jsx("h2", { className: "text-2xl font-bold text-white mb-2 truncate", children: viewingProblem.title }), /*#__PURE__*/

              _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm", children: [/*#__PURE__*/
                _jsx("span", { className: cn(
                    "px-2.5 py-1 rounded-md font-medium whitespace-nowrap",
                    viewingProblem.difficulty === 'Easy' ? "bg-emerald-500/10 text-emerald-400" :
                    viewingProblem.difficulty === 'Medium' ? "bg-amber-500/10 text-amber-400" :
                    "bg-rose-500/10 text-rose-400"
                  ), children:
                  viewingProblem.difficulty }
                ), /*#__PURE__*/
                _jsx("span", { className: "text-slate-400 whitespace-nowrap", children: viewingProblem.platform }),
                viewingProblem.link && /*#__PURE__*/
                _jsxs("a", { href: viewingProblem.link, target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:text-blue-300 flex items-center gap-1 whitespace-nowrap", children: [/*#__PURE__*/
                  _jsx(ExternalLink, { className: "h-3 w-3" }), " Link"] }
                )] }

              )] }
            ), /*#__PURE__*/
            _jsx("div", { className: "flex-shrink-0 flex items-center gap-3 ml-4", children:
              !isEditingView ? /*#__PURE__*/
              _jsxs("button", {
                onClick: handleStartEditing,
                className: "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2", children: [/*#__PURE__*/

                _jsx(Edit2, { className: "h-4 w-4" }), " Edit Problem"] }
              ) : /*#__PURE__*/

              _jsxs("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsx("button", {
                  onClick: handleSaveProblem,
                  className: "px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium text-sm", children:
                  "Save All" }

                ), /*#__PURE__*/
                _jsx("button", {
                  onClick: () => setIsEditingView(false),
                  className: "px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors font-medium text-sm", children:
                  "Cancel" }

                )] }
              ) }

            )] }
          ) }
        ), /*#__PURE__*/


        _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6", children: [/*#__PURE__*/

          _jsxs("div", { className: "bg-[#1e293b] border border-slate-700 rounded-xl p-6 shadow-xl h-fit", children: [/*#__PURE__*/
            _jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2", children: [/*#__PURE__*/
              _jsx(FileCode2, { className: "h-5 w-5 text-blue-400" }), "Problem Statement"] }

            ),
            isEditingView ? /*#__PURE__*/
            _jsx(MarkdownEditor, {
              value: editDescription,
              onChange: setEditDescription,
              placeholder: "Paste the problem description here...",
              minHeight: "600px",
              showTemplateButton: false }
            ) : /*#__PURE__*/

            _jsx(MarkdownRenderer, { content: viewingProblem.description || "" })] }

          ), /*#__PURE__*/


          _jsxs("div", { className: "bg-[#1e293b] border border-slate-700 rounded-xl p-6 shadow-xl space-y-6 h-fit", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-center justify-between border-b border-slate-700/50 pb-4", children: [/*#__PURE__*/
              _jsxs("h3", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [/*#__PURE__*/
                _jsx(Eye, { className: "h-5 w-5 text-emerald-400" }), "Solution"] }

              ), /*#__PURE__*/
              _jsx("div", { className: "flex items-center gap-3", children: /*#__PURE__*/
                _jsxs("select", {
                  className: cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500",
                    viewingProblem.status === 'Solved' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    viewingProblem.status === 'Revised' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-slate-800 text-slate-400 border border-slate-700"
                  ),
                  value: viewingProblem.status,
                  onChange: (e) => updateProblemStatus(viewingProblem.id, e.target.value), children: [/*#__PURE__*/

                  _jsx("option", { value: "To Do", children: "To Do" }), /*#__PURE__*/
                  _jsx("option", { value: "Solved", children: "Solved" }), /*#__PURE__*/
                  _jsx("option", { value: "Revised", children: "Revised" })] }
                ) }
              )] }
            ), /*#__PURE__*/

            _jsx("div", { className: "space-y-6", children:
              isEditingView ? /*#__PURE__*/
              _jsxs(_Fragment, { children: [/*#__PURE__*/
                _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
                  _jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest", children: "Approach / Notes (Markdown Supported)" }), /*#__PURE__*/
                  _jsx(MarkdownEditor, {
                    value: editApproach,
                    onChange: (value) => setEditApproach(value),
                    placeholder: "Describe your approach...",
                    minHeight: "500px",
                    showTemplateButton: false }
                  )] }
                ), /*#__PURE__*/
                _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
                  _jsxs("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsx("label", { className: "text-xs font-bold text-slate-500 uppercase tracking-widest", children: "Code" }), /*#__PURE__*/
                    _jsx("select", {
                      className: "bg-slate-800 text-[10px] text-slate-400 rounded px-1.5 py-0.5 focus:outline-none border border-slate-700",
                      value: editLanguage,
                      onChange: (e) => setEditLanguage(e.target.value), children:

                      LANGUAGES.map((lang) => /*#__PURE__*/
                      _jsx("option", { value: lang, children: lang }, lang)
                      ) }
                    )] }
                  ), /*#__PURE__*/
                  _jsx("div", { className: "rounded-lg border border-slate-700 overflow-hidden", children: /*#__PURE__*/
                    _jsx(CodeMirror, {
                      value: editCode,
                      height: "300px",
                      theme: vscodeDark,
                      extensions: getLanguageExtension(editLanguage),
                      onChange: (value) => setEditCode(value),
                      basicSetup: {
                        lineNumbers: true,
                        autocompletion: true,
                        foldGutter: true,
                        highlightActiveLine: true
                      },
                      className: "text-sm" }
                    ) }
                  )] }
                )] }
              ) : /*#__PURE__*/

              _jsxs(_Fragment, { children: [
                (viewingProblem.approach || viewingProblem.notes) && /*#__PURE__*/
                _jsxs("div", { children: [/*#__PURE__*/
                  _jsx("h4", { className: "text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider", children: "Approach / Notes" }), /*#__PURE__*/
                  _jsx("div", { className: "bg-[#0f172a] p-4 rounded-lg border border-slate-700/50", children: /*#__PURE__*/
                    _jsx(MarkdownRenderer, { content: viewingProblem.approach || viewingProblem.notes, className: "prose-sm" }) }
                  )] }
                ),


                viewingProblem.code && /*#__PURE__*/
                _jsxs("div", { children: [/*#__PURE__*/
                  _jsx("h4", { className: "text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider", children: "Code" }), /*#__PURE__*/
                  _jsx(CodeBlock, { code: viewingProblem.code, language: viewingProblem.language })] }
                ),


                !viewingProblem.approach && !viewingProblem.notes && !viewingProblem.code && /*#__PURE__*/
                _jsx("div", { className: "text-slate-500 text-sm italic text-center py-8", children: "No solution provided yet. Click \"Edit Problem\" to add one." }

                )] }

              ) }

            )] }
          )] }
        )] }
      ),



      view === 'list' && /*#__PURE__*/
      _jsx("div", { className: "space-y-6", children:
        topics.length === 0 ? /*#__PURE__*/
        _jsxs("div", { className: "bg-bg-surface border border-border-main border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center", children: [/*#__PURE__*/
          _jsx(Folder, { className: "h-12 w-12 text-text-muted mb-4" }), /*#__PURE__*/
          _jsx("p", { className: "text-text-muted", children: "No folders yet. Create a folder to organize your problems!" })] }
        ) : /*#__PURE__*/

        _jsx(DragDropContext, { onDragEnd: handleDragEnd, children: /*#__PURE__*/
          _jsx(Droppable, { droppableId: "topics-list", children:
            (provided) => /*#__PURE__*/
            _jsxs("div", { ...provided.droppableProps, ref: provided.innerRef, className: "space-y-6", children: [
              topics.map((topic, index) => {
                const topicQuestions = questions.filter((q) => q.topicId === topic.id);
                const Icon = getIconComponent(topic.icon);

                return (/*#__PURE__*/
                  _jsx(Draggable, { draggableId: topic.id, index: index, children:
                    (provided, snapshot) => /*#__PURE__*/
                    _jsxs("div", {
                      ref: provided.innerRef, ...
                      provided.draggableProps,
                      className: cn(
                        "bg-bg-surface border border-border-main rounded-xl overflow-hidden shadow-lg transition-all",
                        snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500/50 scale-[1.02]" : "",
                        activeFolderId === topic.id ? "ring-2 ring-blue-500/50" : ""
                      ),
                      onClick: () => setActiveFolderId(topic.id), children: [/*#__PURE__*/


                      _jsxs("div", { className: "bg-bg-surface/50 px-4 sm:px-6 py-3 sm:py-4 border-b border-border-main flex items-center justify-between group", children: [/*#__PURE__*/
                        _jsxs("div", { className: "flex-1 min-w-0 flex items-center gap-3", children: [/*#__PURE__*/
                          _jsx("div", { ...
                            provided.dragHandleProps,
                            className: "flex-shrink-0 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-main p-1 -ml-2", children: /*#__PURE__*/

                            _jsx(GripVertical, { className: "h-4 w-4" }) }
                          ), /*#__PURE__*/
                          _jsx(Icon, { className: "flex-shrink-0 h-5 w-5 text-blue-400" }), /*#__PURE__*/
                          _jsx("h2", { className: "text-lg font-semibold text-text-main truncate", children: topic.name }), /*#__PURE__*/
                          _jsx("span", { className: "flex-shrink-0 bg-bg-surface border border-border-main text-text-muted text-xs px-2 py-0.5 rounded-full", children:
                            topicQuestions.length }
                          )] }
                        ), /*#__PURE__*/
                        _jsxs("div", { className: "flex-shrink-0 flex items-center gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all", children: [/*#__PURE__*/
                          _jsxs("button", {
                            onClick: (e) => {
                              e.stopPropagation();
                              setNewQuestion({ ...newQuestion, topicId: topic.id });
                              setView('new-problem');
                            },
                            className: "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors font-bold text-[10px] uppercase tracking-widest flex items-center gap-2", children: [/*#__PURE__*/

                            _jsx(Plus, { className: "h-3 w-3" }), /*#__PURE__*/_jsx("span", { className: "hidden sm:inline", children: " Add Problem" })] }
                          ), /*#__PURE__*/
                          _jsx("div", { className: "h-4 w-px bg-border-main mx-1" }), /*#__PURE__*/
                          _jsx("button", {
                            onClick: (e) => {
                              e.stopPropagation();
                              setEditingFolder({ id: topic.id, name: topic.name, icon: topic.icon || 'Folder' });
                              setView('edit-folder');
                            },
                            className: "text-text-muted hover:text-blue-400 p-1.5 rounded hover:bg-bg-surface transition-colors",
                            title: "Edit Folder", children: /*#__PURE__*/

                            _jsx(Edit2, { className: "h-4 w-4" }) }
                          ), /*#__PURE__*/
                          _jsx("button", {
                            onClick: (e) => {e.stopPropagation();confirmDeleteTopic(topic.id);},
                            className: "text-text-muted hover:text-rose-400 p-1.5 rounded hover:bg-bg-surface transition-colors",
                            title: "Delete Folder", children: /*#__PURE__*/

                            _jsx(Trash2, { className: "h-4 w-4" }) }
                          )] }
                        )] }
                      ), /*#__PURE__*/


                      _jsx("div", { className: "divide-y divide-border-main/50", children:
                        topicQuestions.length === 0 ? /*#__PURE__*/
                        _jsx("div", { className: "px-6 py-8 text-center text-text-muted text-sm", children: "No problems in this folder yet." }

                        ) :

                        topicQuestions.map((q) => /*#__PURE__*/
                        _jsxs("div", { className: "px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-bg-surface/30 transition-colors group", children: [/*#__PURE__*/
                        _jsxs("div", { className: "flex-1 min-w-0 flex items-center gap-4", children: [/*#__PURE__*/
                          _jsx(FileCode2, { className: "flex-shrink-0 h-5 w-5 text-text-muted" }), /*#__PURE__*/
                          _jsxs("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                            _jsxs("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                              _jsx("h3", { className: "text-text-main font-medium truncate", children: q.title }),
                              q.link && /*#__PURE__*/
                              _jsx("a", { href: q.link, target: "_blank", rel: "noreferrer", className: "flex-shrink-0 text-blue-400 hover:text-blue-300", children: /*#__PURE__*/
                                _jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }
                              )] }

                            ), /*#__PURE__*/
                            _jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs overflow-x-auto no-scrollbar", children: [/*#__PURE__*/
                              _jsx("span", { className: cn(
                                  "flex-shrink-0 px-2 py-0.5 rounded-full border",
                                  q.difficulty === 'Easy' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" :
                                  q.difficulty === 'Medium' ? "text-amber-400 border-amber-400/20 bg-amber-400/10" :
                                  "text-rose-400 border-rose-400/20 bg-rose-400/10"
                                ), children:
                                q.difficulty }
                              ), /*#__PURE__*/
                              _jsx("span", { className: "flex-shrink-0 text-text-muted", children: q.platform }), /*#__PURE__*/
                              _jsx("div", { className: cn(
                                  "flex-shrink-0 flex items-center gap-1.5 before:content-[''] before:block before:w-1.5 before:h-1.5 before:rounded-full",
                                  q.status === 'Solved' ? "before:bg-emerald-400" :
                                  q.status === 'Revised' ? "before:bg-amber-400" :
                                  "before:bg-slate-400"
                                ), children: /*#__PURE__*/
                                _jsxs("select", {
                                  className: cn(
                                    "appearance-none bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer text-xs font-medium",
                                    q.status === 'Solved' ? "text-emerald-400" :
                                    q.status === 'Revised' ? "text-amber-400" :
                                    "text-text-muted"
                                  ),
                                  value: q.status,
                                  onChange: (e) => updateProblemStatus(q.id, e.target.value),
                                  onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/

                                  _jsx("option", { value: "To Do", className: "bg-bg-surface text-text-main", children: "To Do" }), /*#__PURE__*/
                                  _jsx("option", { value: "Solved", className: "bg-bg-surface text-emerald-400", children: "Solved" }), /*#__PURE__*/
                                  _jsx("option", { value: "Revised", className: "bg-bg-surface text-amber-400", children: "Revised" })] }
                                ) }
                              )] }
                            )] }
                          )] }
                        ), /*#__PURE__*/

                          _jsxs("div", { className: "flex-shrink-0 flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all", children: [/*#__PURE__*/
                            _jsx("button", {
                              onClick: (e) => {
                                e.stopPropagation();
                                setViewingProblem(q);
                                setView('view-problem');
                              },
                              className: "text-text-muted hover:text-blue-400 p-2 rounded hover:bg-bg-surface transition-colors",
                              title: "View Problem", children: /*#__PURE__*/

                              _jsx(Eye, { className: "h-4 w-4" }) }
                            ), /*#__PURE__*/
                            _jsx("button", {
                              onClick: (e) => {e.stopPropagation();confirmDeleteQuestion(q.id);},
                              className: "text-text-muted hover:text-rose-400 p-2 rounded hover:bg-bg-surface transition-colors",
                              title: "Delete Problem", children: /*#__PURE__*/

                              _jsx(Trash2, { className: "h-4 w-4" }) }
                            )] }
                          )] }, q.id
                        )
                        ) }

                      )] }
                    ) }, topic.id

                  ));

              }),
              provided.placeholder] }
            ) }

          ) }
        ) }

      )] }

    ));

}