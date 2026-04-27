import React, { useState, useEffect } from 'react';

import { localStore } from '../lib/api';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Trash2, Folder, FileText, Edit2, Plus, ArrowLeft, GripVertical, Mic, MicOff } from 'lucide-react';
import { cn } from '../lib/utils';
import ConfirmModal from '../components/ConfirmModal';
import { IconPicker, getIconComponent } from '../lib/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAppStore } from '../lib/store';
import { toast } from 'sonner';import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";



export default function Notes() {
  const { activeFolderId, activeNoteId, setActiveFolderId, setActiveNoteId } = useAppStore();

  const [view, setView] = useState('list');
  const [viewingNote, setViewingNote] = useState(null);
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [folderName, setFolderName] = useState('');
  const [folderIcon, setFolderIcon] = useState('Folder');
  const [editingFolder, setEditingFolder] = useState(null);
  const [newNote, setNewNote] = useState({
    folderId: '',
    title: '',
    content: ''
  });
  const [editingNote, setEditingNote] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      setRecognition(rec);
    }
  }, []);

  const toggleListening = (target) => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      let lastProcessedResultIndex = -1;

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal && i > lastProcessedResultIndex) {
            transcript += event.results[i][0].transcript;
            lastProcessedResultIndex = i;
          }
        }
        if (transcript) {
          if (target === 'new') {
            setNewNote((prev) => ({ ...prev, content: prev.content + (prev.content ? ' ' : '') + transcript }));
          } else {
            setEditingNote((prev) => prev ? { ...prev, content: prev.content + (prev.content ? ' ' : '') + transcript } : null);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
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
      setFolders(await localStore.getNoteFolders());
      setNotes(await localStore.getNotes());
      setLoading(false);
    };
    loadData();
  }, []);

  const refreshData = async () => {
    setFolders(await localStore.getNoteFolders());
    setNotes(await localStore.getNotes());
  };

  // Sync view with global state
  useEffect(() => {
    if (activeNoteId) {
      const note = notes.find((n) => n.id === activeNoteId);
      if (note) {
        setViewingNote(note);
        setView('view-note');
      }
    }
  }, [activeNoteId, notes]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    if (folders.some((f) => f.name.toLowerCase() === folderName.trim().toLowerCase())) {
      setError('A folder with this name already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.saveNoteFolder({
        name: folderName.trim(),
        icon: folderIcon,
        order: folders.length + 1
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

    if (folders.some((f) => f.id !== editingFolder.id && f.name.toLowerCase() === editingFolder.name.trim().toLowerCase())) {
      setError('A folder with this name already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.updateNoteFolder(editingFolder.id, {
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

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.folderId || !newNote.title.trim() || !newNote.content) return;

    if (notes.some((n) => n.title.toLowerCase() === newNote.title.trim().toLowerCase())) {
      setError('A note with this title already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.saveNote({
        ...newNote,
        title: newNote.title.trim(),
        order: notes.length + 1
      });
      setNewNote({ folderId: '', title: '', content: '' });
      setView('list');
      refreshData();
      toast.success('Note added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add note');
    }
  };

  const confirmDeleteFolder = (id) => {
    setDeleteModal({
      isOpen: true,
      type: 'folder',
      id,
      title: 'Delete Folder',
      message: 'Are you sure you want to delete this folder? All notes inside will remain but lose their folder association unless deleted separately.'
    });
  };

  const confirmDeleteNote = (id) => {
    setDeleteModal({
      isOpen: true,
      type: 'note',
      id,
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.'
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      if (deleteModal.type === 'folder') {
        await localStore.deleteNoteFolder(deleteModal.id);
        if (activeFolderId === deleteModal.id) setActiveFolderId(null);
        toast.success('Folder deleted');
      } else if (deleteModal.type === 'note') {
        await localStore.deleteNote(deleteModal.id);
        if (activeNoteId === deleteModal.id) setActiveNoteId(null);
        toast.success('Note deleted');
      }
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete');
    }
  };

  const openNewNoteForFolder = (folderId) => {
    setNewNote((prev) => ({ ...prev, folderId }));
    setView('new-note');
  };

  const handleEditNoteClick = (note) => {
    setEditingNote(note);
    setView('edit-note');
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!editingNote || !editingNote.folderId || !editingNote.title.trim() || !editingNote.content) return;

    if (notes.some((n) => n.id !== editingNote.id && n.title.toLowerCase() === editingNote.title.trim().toLowerCase())) {
      setError('A note with this title already exists.');
      return;
    }

    try {
      setError(null);
      await localStore.updateNote(editingNote.id, {
        folderId: editingNote.folderId,
        title: editingNote.title.trim(),
        content: editingNote.content
      });
      setEditingNote(null);
      setView('list');
      refreshData();
      toast.success('Note updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update note');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newFolders = Array.from(folders);
    const [reorderedItem] = newFolders.splice(sourceIndex, 1);
    newFolders.splice(destinationIndex, 0, reorderedItem);

    setFolders(newFolders);

    // Update order in local storage
    try {
      await Promise.all(newFolders.map((folder, index) => 
        localStore.updateNoteFolder(folder.id, { order: index + 1 })
      ));
      toast.success('Folder order updated');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return null;

  return (/*#__PURE__*/
    _jsxs("div", { className: "max-w-[1440px] mx-auto space-y-8", children: [/*#__PURE__*/
      _jsx(ConfirmModal, {
        isOpen: deleteModal.isOpen,
        title: deleteModal.title,
        message: deleteModal.message,
        onConfirm: handleConfirmDelete,
        onCancel: () => setDeleteModal((prev) => ({ ...prev, isOpen: false })) }
      ), /*#__PURE__*/


      _jsxs("header", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsx("h1", { className: "text-3xl font-bold text-text-main", children: "Notes" }), /*#__PURE__*/
        _jsx("div", { className: "flex gap-3", children:
          view === 'view-note' ? /*#__PURE__*/
          _jsxs("button", { onClick: () => {setView('list');setViewingNote(null);setError(null);setActiveNoteId(null);}, className: "px-4 py-2 flex items-center gap-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-medium text-sm", children: [/*#__PURE__*/
            _jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to List"] }
          ) :
          view !== 'list' ? /*#__PURE__*/
          _jsx("button", { onClick: () => {setView('list');setEditingNote(null);setError(null);}, className: "px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-medium text-sm", children: "Cancel" }

          ) : /*#__PURE__*/

          _jsx(_Fragment, { children: /*#__PURE__*/
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
              placeholder: "e.g., System Design, React Concepts",
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
              placeholder: "e.g., System Design, React Concepts",
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



      view === 'new-note' && /*#__PURE__*/
      _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-4", children: [
        error && /*#__PURE__*/
        _jsx("div", { className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm", children:
          error }
        ), /*#__PURE__*/

        _jsxs("form", { onSubmit: handleAddNote, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Select Folder *" }), /*#__PURE__*/
            _jsxs("select", {
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors appearance-none",
              value: newNote.folderId,
              onChange: (e) => setNewNote({ ...newNote, folderId: e.target.value }),
              required: true, children: [/*#__PURE__*/

              _jsx("option", { value: "", disabled: true, children: "Select a folder..." }),
              folders.map((f) => /*#__PURE__*/
              _jsx("option", { value: f.id, children: f.name }, f.id)
              )] }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Note Title *" }), /*#__PURE__*/
            _jsx("input", {
              type: "text",
              placeholder: "e.g., Binary Search Template",
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
              value: newNote.title,
              onChange: (e) => setNewNote({ ...newNote, title: e.target.value }),
              required: true }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Content (Markdown Supported) *" }), /*#__PURE__*/
              _jsxs("button", {
                type: "button",
                onClick: () => toggleListening('new'),
                className: cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all",
                  isListening ?
                  "bg-rose-500/20 text-rose-400 animate-pulse" :
                  "bg-bg-surface border border-border-main text-text-muted hover:bg-bg-main"
                ), children: [

                isListening ? /*#__PURE__*/_jsx(MicOff, { className: "h-3.5 w-3.5" }) : /*#__PURE__*/_jsx(Mic, { className: "h-3.5 w-3.5" }),
                isListening ? 'Stop Listening' : 'Voice to Text'] }
              )] }
            ), /*#__PURE__*/
            _jsx(MarkdownEditor, {
              value: newNote.content,
              onChange: (value) => setNewNote({ ...newNote, content: value }),
              placeholder: "Write your notes here... (Markdown supported)",
              minHeight: "600px" }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "flex gap-3", children: [/*#__PURE__*/
            _jsx("button", { type: "submit", className: "px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium", children: "Add Note" }

            ), /*#__PURE__*/
            _jsx("button", { type: "button", onClick: () => setView('list'), className: "px-6 py-2.5 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-main transition-colors font-medium", children: "Cancel" }

            )] }
          )] }
        )] }
      ),



      view === 'edit-note' && editingNote && /*#__PURE__*/
      _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl space-y-4", children: [
        error && /*#__PURE__*/
        _jsx("div", { className: "p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm", children:
          error }
        ), /*#__PURE__*/

        _jsxs("form", { onSubmit: handleUpdateNote, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Select Folder *" }), /*#__PURE__*/
            _jsx("select", {
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors appearance-none",
              value: editingNote.folderId,
              onChange: (e) => setEditingNote({ ...editingNote, folderId: e.target.value }),
              required: true, children:

              folders.map((f) => /*#__PURE__*/
              _jsx("option", { value: f.id, children: f.name }, f.id)
              ) }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Note Title *" }), /*#__PURE__*/
            _jsx("input", {
              type: "text",
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
              value: editingNote.title,
              onChange: (e) => setEditingNote({ ...editingNote, title: e.target.value }),
              required: true }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Content (Markdown Supported) *" }), /*#__PURE__*/
              _jsxs("button", {
                type: "button",
                onClick: () => toggleListening('edit'),
                className: cn(
                  "flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all",
                  isListening ?
                  "bg-rose-500/20 text-rose-400 animate-pulse" :
                  "bg-bg-surface border border-border-main text-text-muted hover:bg-bg-main"
                ), children: [

                isListening ? /*#__PURE__*/_jsx(MicOff, { className: "h-3.5 w-3.5" }) : /*#__PURE__*/_jsx(Mic, { className: "h-3.5 w-3.5" }),
                isListening ? 'Stop Listening' : 'Voice to Text'] }
              )] }
            ), /*#__PURE__*/
            _jsx(MarkdownEditor, {
              value: editingNote.content,
              onChange: (value) => setEditingNote({ ...editingNote, content: value }),
              placeholder: "Write your notes here... (Markdown supported)",
              minHeight: "600px" }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "flex gap-3", children: [/*#__PURE__*/
            _jsx("button", { type: "submit", className: "px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium", children: "Save Changes" }

            ), /*#__PURE__*/
            _jsx("button", { type: "button", onClick: () => {setView('list');setEditingNote(null);}, className: "px-6 py-2.5 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-main transition-colors font-medium", children: "Cancel" }

            )] }
          )] }
        )] }
      ),



      view === 'view-note' && viewingNote && /*#__PURE__*/
      _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-8 shadow-xl", children: [/*#__PURE__*/
        _jsx("h2", { className: "text-3xl font-bold text-text-main mb-6", children: viewingNote.title }), /*#__PURE__*/
        _jsx(MarkdownRenderer, { content: viewingNote.content, className: "text-lg" })] }
      ),



      view === 'list' && /*#__PURE__*/
      _jsx("div", { className: "space-y-6", children:
        folders.length === 0 ? /*#__PURE__*/
        _jsxs("div", { className: "bg-bg-surface border border-border-main border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center", children: [/*#__PURE__*/
          _jsx(Folder, { className: "h-12 w-12 text-text-muted mb-4" }), /*#__PURE__*/
          _jsx("p", { className: "text-text-muted", children: "No folders yet. Create a folder to organize your notes!" })] }
        ) : /*#__PURE__*/

        _jsx(DragDropContext, { onDragEnd: handleDragEnd, children: /*#__PURE__*/
          _jsx(Droppable, { droppableId: "folders-list", children:
            (provided) => /*#__PURE__*/
            _jsxs("div", { ...provided.droppableProps, ref: provided.innerRef, className: "space-y-6", children: [
              folders.map((folder, index) => {
                const folderNotes = notes.filter((n) => n.folderId === folder.id);
                const Icon = getIconComponent(folder.icon);

                return (/*#__PURE__*/
                  _jsx(Draggable, { draggableId: folder.id, index: index, children:
                    (provided, snapshot) => /*#__PURE__*/
                    _jsxs("div", {
                      ref: provided.innerRef, ...
                      provided.draggableProps,
                      className: cn(
                        "bg-bg-surface border border-border-main rounded-xl overflow-hidden shadow-lg transition-all",
                        snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500/50 scale-[1.02]" : "",
                        activeFolderId === folder.id ? "ring-2 ring-blue-500/50" : ""
                      ),
                      onClick: () => setActiveFolderId(folder.id), children: [/*#__PURE__*/


                      _jsxs("div", { className: "bg-bg-surface/50 px-4 sm:px-6 py-3 sm:py-4 border-b border-border-main flex items-center justify-between group", children: [/*#__PURE__*/
                        _jsxs("div", { className: "flex-1 min-w-0 flex items-center gap-3", children: [/*#__PURE__*/
                          _jsx("div", { ...
                            provided.dragHandleProps,
                            className: "flex-shrink-0 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-main p-1 -ml-2", children: /*#__PURE__*/

                            _jsx(GripVertical, { className: "h-4 w-4" }) }
                          ), /*#__PURE__*/
                          _jsx(Icon, { className: "flex-shrink-0 h-5 w-5 text-text-muted fill-text-muted/20" }), /*#__PURE__*/
                          _jsx("h2", { className: "text-lg font-bold text-text-main truncate", children: folder.name }), /*#__PURE__*/
                          _jsxs("span", { className: "flex-shrink-0 text-text-muted text-sm", children: ["(",
                            folderNotes.length, ")"] }
                          )] }
                        ), /*#__PURE__*/
                        _jsxs("div", { className: "flex-shrink-0 flex items-center gap-1 sm:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all", children: [/*#__PURE__*/
                          _jsxs("button", {
                            onClick: (e) => {e.stopPropagation();openNewNoteForFolder(folder.id);},
                            className: "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors font-bold text-[10px] uppercase tracking-widest flex items-center gap-2", children: [/*#__PURE__*/

                            _jsx(Plus, { className: "h-3 w-3" }), /*#__PURE__*/_jsx("span", { className: "hidden sm:inline", children: " Add Note" })] }
                          ), /*#__PURE__*/
                          _jsx("button", {
                            onClick: (e) => {
                              e.stopPropagation();
                              setEditingFolder({ id: folder.id, name: folder.name, icon: folder.icon || 'Folder' });
                              setView('edit-folder');
                            },
                            className: "text-text-muted hover:text-blue-400 p-1.5 rounded hover:bg-bg-surface transition-colors",
                            title: "Edit Folder", children: /*#__PURE__*/

                            _jsx(Edit2, { className: "h-4 w-4" }) }
                          ), /*#__PURE__*/
                          _jsx("button", {
                            onClick: (e) => {e.stopPropagation();confirmDeleteFolder(folder.id);},
                            className: "text-text-muted hover:text-rose-400 p-1.5 rounded hover:bg-bg-surface transition-colors",
                            title: "Delete Folder", children: /*#__PURE__*/

                            _jsx(Trash2, { className: "h-4 w-4" }) }
                          )] }
                        )] }
                      ), /*#__PURE__*/


                      _jsx("div", { className: "divide-y divide-border-main/50", children:
                        folderNotes.length === 0 ? /*#__PURE__*/
                        _jsx("div", { className: "px-6 py-8 text-center text-text-muted text-sm", children: "No notes in this folder yet." }

                        ) :

                        folderNotes.map((note) => /*#__PURE__*/
                        _jsxs("div", {

                          className: cn(
                            "px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-2 hover:bg-bg-surface/30 transition-colors group cursor-pointer",
                            activeNoteId === note.id ? "bg-blue-500/5" : ""
                          ),
                          onClick: (e) => {
                            e.stopPropagation();
                            setViewingNote(note);
                            setView('view-note');
                            setActiveNoteId(note.id);
                          }, children: [/*#__PURE__*/

                          _jsxs("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                            _jsxs("div", { className: "flex-1 min-w-0 flex items-center gap-3", children: [/*#__PURE__*/
                              _jsx(FileText, { className: cn("flex-shrink-0 h-4 w-4", activeNoteId === note.id ? "text-blue-500" : "text-blue-400") }), /*#__PURE__*/
                              _jsx("h3", { className: cn("font-medium truncate", activeNoteId === note.id ? "text-blue-500" : "text-text-main"), children: note.title })] }
                            ), /*#__PURE__*/
                            _jsxs("div", { className: "flex-shrink-0 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all", children: [/*#__PURE__*/
                              _jsx("button", {
                                onClick: (e) => {e.stopPropagation();handleEditNoteClick(note);},
                                className: "text-text-muted hover:text-blue-400 p-1.5 rounded hover:bg-bg-surface transition-colors",
                                title: "Edit Note", children: /*#__PURE__*/

                                _jsx(Edit2, { className: "h-4 w-4" }) }
                              ), /*#__PURE__*/
                              _jsx("button", {
                                onClick: (e) => {e.stopPropagation();confirmDeleteNote(note.id);},
                                className: "text-text-muted hover:text-rose-400 p-1.5 rounded hover:bg-bg-surface transition-colors",
                                title: "Delete Note", children: /*#__PURE__*/

                                _jsx(Trash2, { className: "h-4 w-4" }) }
                              )] }
                            )] }
                          ), /*#__PURE__*/
                          _jsx("p", { className: "text-text-muted text-sm line-clamp-1 pl-7 whitespace-pre-wrap", children:
                            note.content }
                          )] }, note.id
                        )
                        ) }

                      )] }
                    ) }, folder.id

                  ));

              }),
              provided.placeholder] }
            ) }

          ) }
        ) }

      )] }

    ));

}