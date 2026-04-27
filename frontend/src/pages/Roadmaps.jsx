import React, { useState, useEffect } from 'react';

import { localStore } from '../lib/api';
import { CheckSquare, X } from 'lucide-react';
import { cn } from '../lib/utils';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";



export default function Roadmaps() {
  const [view, setView] = useState('list');
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [topics, setTopics] = useState([]);

  const [deleteModal, setDeleteModal] = useState(




    {
      isOpen: false,
      id: null,
      title: '',
      message: ''
    });

  useEffect(() => {
    const loadData = async () => {
      setRoadmaps(await localStore.getRoadmaps());
      setLoading(false);
    };
    loadData();
  }, []);

  const refreshData = async () => {
    setRoadmaps(await localStore.getRoadmaps());
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCurrentTopic('');
    setTopics([]);
    setEditingId(null);
  };

  const handleAddTopicToForm = async (e) => {
    if (e) e.preventDefault();
    if (!currentTopic.trim()) return;

    const newTopic = {
      id: crypto.randomUUID(),
      title: currentTopic.trim(),
      isCompleted: false
    };

    setTopics([...topics, newTopic]);
    setCurrentTopic('');
  };

  const handleRemoveTopicFromForm = (id) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!title.trim() || topics.length === 0) return;

    try {
      await localStore.saveRoadmap({
        title: title.trim(),
        description: description.trim(),
        topics,
        order: roadmaps.length + 1
      });
      toast.success('Roadmap created successfully');
      refreshData();
      resetForm();
      setView('list');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create roadmap');
    }
  };

  const handleUpdateRoadmap = async (e) => {
    e.preventDefault();
    if (!editingId || !title.trim() || topics.length === 0) return;

    try {
      await localStore.updateRoadmap(editingId, {
        title: title.trim(),
        description: description.trim(),
        topics
      });
      toast.success('Roadmap updated successfully');
      refreshData();
      resetForm();
      setView('list');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update roadmap');
    }
  };

  const confirmDeleteRoadmap = (id) => {
    setDeleteModal({
      isOpen: true,
      id,
      title: 'Delete Roadmap',
      message: 'Are you sure you want to delete this roadmap? This action cannot be undone.'
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await localStore.deleteRoadmap(deleteModal.id);
      toast.success('Roadmap deleted successfully');
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete roadmap');
    }
  };

  const handleEditClick = (roadmap) => {
    setEditingId(roadmap.id);
    setTitle(roadmap.title);
    setDescription(roadmap.description || '');
    setTopics(roadmap.topics);
    setView('edit');
  };

  const toggleTopicCompletion = async (roadmap, topicId) => {
    const updatedTopics = roadmap.topics.map((t) =>
    t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
    );

    try {
      await localStore.updateRoadmap(roadmap.id, {
        topics: updatedTopics
      });
      refreshData();
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


      _jsxs("header", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [/*#__PURE__*/
        _jsx("h1", { className: "text-3xl font-bold text-text-main", children: "Roadmap Planner" }), /*#__PURE__*/
        _jsx("div", { className: "flex gap-3 w-full sm:w-auto", children:
          view !== 'list' ? /*#__PURE__*/
          _jsx("button", { onClick: () => {setView('list');resetForm();}, className: "w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-medium text-sm text-center", children: "Cancel" }

          ) : /*#__PURE__*/

          _jsx("button", { onClick: () => setView('create'), className: "w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm text-center", children: "+ Create Roadmap" }

          ) }

        )] }
      ),


      (view === 'create' || view === 'edit') && /*#__PURE__*/
      _jsx("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-xl", children: /*#__PURE__*/
        _jsxs("form", { onSubmit: view === 'create' ? handleCreateRoadmap : handleUpdateRoadmap, className: "space-y-6", children: [/*#__PURE__*/
          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Roadmap Title *" }), /*#__PURE__*/
            _jsx("input", {
              type: "text",
              placeholder: "e.g., 90 Days DSA Challenge",
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              required: true }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Description" }), /*#__PURE__*/
            _jsx("textarea", {
              placeholder: "Describe your learning goals and plan...",
              className: "w-full bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors h-24 resize-y",
              value: description,
              onChange: (e) => setDescription(e.target.value) }
            )] }
          ), /*#__PURE__*/

          _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsx("label", { className: "text-sm font-medium text-text-muted", children: "Topics *" }), /*#__PURE__*/
            _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [/*#__PURE__*/
              _jsx("input", {
                type: "text",
                placeholder: "Add a topic (e.g., Arrays, Binary Search)",
                className: "w-full sm:flex-1 bg-bg-main border border-border-main rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-blue-500 transition-colors",
                value: currentTopic,
                onChange: (e) => setCurrentTopic(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopicToForm();
                  }
                } }
              ), /*#__PURE__*/
              _jsx("button", {
                type: "button",
                onClick: () => handleAddTopicToForm(),
                className: "w-full sm:w-auto px-6 py-3 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-surface/80 transition-colors font-medium whitespace-nowrap text-center", children:
                "Add Topic" }

              )] }
            ),

            topics.length > 0 && /*#__PURE__*/
            _jsx("div", { className: "mt-4 space-y-2", children:
              topics.map((topic, index) => /*#__PURE__*/
              _jsxs("div", { className: "flex items-center justify-between bg-bg-main border border-border-main rounded-lg px-4 py-2", children: [/*#__PURE__*/
                _jsxs("span", { className: "text-text-muted text-sm", children: [index + 1, ". ", topic.title] }), /*#__PURE__*/
                _jsx("button", {
                  type: "button",
                  onClick: () => handleRemoveTopicFromForm(topic.id),
                  className: "text-text-muted hover:text-rose-400 p-1", children: /*#__PURE__*/

                  _jsx(X, { className: "h-4 w-4" }) }
                )] }, topic.id
              )
              ) }
            ),

            topics.length === 0 && /*#__PURE__*/
            _jsx("p", { className: "text-xs text-rose-400 mt-1", children: "At least one topic is required." })] }

          ), /*#__PURE__*/

          _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-4", children: [/*#__PURE__*/
            _jsx("button", {
              type: "submit",
              disabled: topics.length === 0 || !title.trim(),
              className: "w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-center", children:

              view === 'create' ? 'Create Roadmap' : 'Save Changes' }
            ), /*#__PURE__*/
            _jsx("button", { type: "button", onClick: () => {setView('list');resetForm();}, className: "w-full sm:w-auto px-6 py-2.5 rounded-lg bg-bg-surface border border-border-main text-text-main hover:bg-bg-surface/80 transition-colors font-medium text-center", children: "Cancel" }

            )] }
          )] }
        ) }
      ),



      view === 'list' && /*#__PURE__*/
      _jsx("div", { className: "space-y-6", children:
        roadmaps.length === 0 ? /*#__PURE__*/
        _jsx("div", { className: "bg-bg-surface border border-border-main rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-sm", children: /*#__PURE__*/
          _jsx("p", { className: "text-text-muted", children: "No roadmaps yet. Create your first learning roadmap!" }) }
        ) :

        roadmaps.map((roadmap) => {
          const completedCount = roadmap.topics.filter((t) => t.isCompleted).length;
          const totalCount = roadmap.topics.length;
          const progressPercentage = totalCount === 0 ? 0 : Math.round(completedCount / totalCount * 100);

          return (/*#__PURE__*/
            _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-xl p-6 shadow-lg space-y-6", children: [/*#__PURE__*/

              _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4", children: [/*#__PURE__*/
                _jsxs("div", { className: "space-y-1", children: [/*#__PURE__*/
                  _jsx("h2", { className: "text-2xl font-bold text-text-main break-words", children: roadmap.title }),
                  roadmap.description && /*#__PURE__*/
                  _jsx("p", { className: "text-text-muted text-sm", children: roadmap.description })] }

                ), /*#__PURE__*/
                _jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [/*#__PURE__*/
                  _jsx("button", {
                    onClick: () => handleEditClick(roadmap),
                    className: "flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-bg-surface border border-border-main text-text-muted hover:text-text-main hover:bg-bg-surface/80 transition-colors text-sm font-medium text-center", children:
                    "Edit" }

                  ), /*#__PURE__*/
                  _jsx("button", {
                    onClick: () => confirmDeleteRoadmap(roadmap.id),
                    className: "flex-1 sm:flex-none px-4 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors text-sm font-medium text-center", children:
                    "Delete" }

                  )] }
                )] }
              ), /*#__PURE__*/


              _jsxs("div", { className: "space-y-2", children: [/*#__PURE__*/
                _jsxs("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
                  _jsx("span", { className: "text-text-muted", children: "Progress" }), /*#__PURE__*/
                  _jsxs("span", { className: "text-blue-400 font-bold", children: [progressPercentage, "%"] })] }
                ), /*#__PURE__*/
                _jsx("div", { className: "w-full bg-bg-main rounded-full h-2 overflow-hidden", children: /*#__PURE__*/
                  _jsx("div", {
                    className: "bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out",
                    style: { width: `${progressPercentage}%` } }
                  ) }
                ), /*#__PURE__*/
                _jsxs("p", { className: "text-xs text-text-muted pt-1", children: [
                  completedCount, " of ", totalCount, " topics completed"] }
                )] }
              ), /*#__PURE__*/


              _jsx("div", { className: "space-y-2", children:
                roadmap.topics.map((topic) => /*#__PURE__*/
                _jsxs("div", {

                  onClick: () => toggleTopicCompletion(roadmap, topic.id),
                  className: "flex items-center gap-3 bg-bg-main border border-border-main/50 rounded-lg px-4 py-3 cursor-pointer hover:bg-bg-surface transition-colors group", children: [/*#__PURE__*/

                  _jsx("div", { className: "flex-shrink-0", children:
                    topic.isCompleted ? /*#__PURE__*/
                    _jsx("div", { className: "h-5 w-5 rounded bg-blue-600 flex items-center justify-center", children: /*#__PURE__*/
                      _jsx(CheckSquare, { className: "h-4 w-4 text-white" }) }
                    ) : /*#__PURE__*/

                    _jsx("div", { className: "h-5 w-5 rounded border-2 border-text-muted group-hover:border-blue-400 transition-colors bg-transparent flex items-center justify-center" }

                    ) }

                  ), /*#__PURE__*/
                  _jsx("span", { className: cn(
                      "text-sm font-medium transition-all",
                      topic.isCompleted ? "text-text-muted line-through" : "text-text-main"
                    ), children:
                    topic.title }
                  )] }, topic.id
                )
                ) }
              )] }, roadmap.id
            ));

        }) }

      )] }

    ));

}