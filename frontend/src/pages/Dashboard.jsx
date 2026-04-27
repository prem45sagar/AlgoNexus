import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area } from
'recharts';
import {
  Trophy, Target, Zap, TrendingUp,
  CheckCircle2, Calendar,
  Map as MapIcon, FileText, RefreshCw, Smartphone, Laptop } from
'lucide-react';
import { localStore } from '../lib/api';
import { cn } from '../lib/utils';

import { Link } from 'react-router-dom';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

const COLORS = {
  Easy: '#10b981', // emerald-500
  Medium: '#f59e0b', // amber-500
  Hard: '#ef4444', // rose-500
  Solved: '#3b82f6', // blue-500
  Revised: '#8b5cf6', // violet-500
  ToDo: '#64748b', // slate-500
  Notes: '#ec4899', // pink-500
  Roadmaps: '#06b6d4' // cyan-500
};

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState({
    questions: true,
    notes: true,
    roadmaps: true
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    const loadData = async () => {
      setQuestions(await localStore.getQuestions());
      setNotes(await localStore.getNotes());
      setRoadmaps(await localStore.getRoadmaps());
      setLoading({ questions: false, notes: false, roadmaps: false });
    };
    loadData();
    return () => clearTimeout(timer);
  }, []);

  const isInitialLoading = loading.questions || loading.notes || loading.roadmaps;

  // Calculate Stats
  const totalProblems = questions.length;
  const solvedProblems = questions.filter((q) => q.status === 'Solved').length;
  const revisedProblems = questions.filter((q) => q.status === 'Revised').length;
  const todoProblems = questions.filter((q) => q.status === 'To Do').length;

  const totalNotes = notes.length;
  const totalRoadmaps = roadmaps.length;

  // Combine recent items
  const recentItems = [
  ...questions.slice(0, 5).map((q) => ({ ...q, type: 'Problem', icon: Target, color: 'text-blue-400' })),
  ...notes.slice(0, 5).map((n) => ({ ...n, type: 'Note', icon: FileText, color: 'text-pink-400' })),
  ...roadmaps.slice(0, 5).map((r) => ({ ...r, type: 'Roadmap', icon: MapIcon, color: 'text-cyan-400' }))].
  sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 6);

  const difficultyData = [
  { name: 'Easy', value: questions.filter((q) => q.difficulty === 'Easy').length, color: COLORS.Easy },
  { name: 'Medium', value: questions.filter((q) => q.difficulty === 'Medium').length, color: COLORS.Medium },
  { name: 'Hard', value: questions.filter((q) => q.difficulty === 'Hard').length, color: COLORS.Hard }].
  filter((d) => d.value > 0);

  const statusData = [
  { name: 'Solved', value: solvedProblems, color: COLORS.Solved },
  { name: 'Revised', value: revisedProblems, color: COLORS.Revised },
  { name: 'To Do', value: todoProblems, color: COLORS.ToDo }].
  filter((d) => d.value > 0);

  const overviewData = [
  { name: 'Problems', value: totalProblems, color: COLORS.Solved },
  { name: 'Notes', value: totalNotes, color: COLORS.Notes },
  { name: 'Roadmaps', value: totalRoadmaps, color: COLORS.Roadmaps }];


  // Group by date for activity chart
  const getActivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    const counts = questions.reduce((acc, q) => {
      if (q.createdAt) {
        const date = new Date(q.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    return last7Days.map((date) => ({
      date: date.split('/').slice(0, 2).join('/'), // Shorten date format
      count: counts[date] || 0
    }));
  };

  const activityData = getActivityData();

  if (isInitialLoading) {
    return (/*#__PURE__*/
      _jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /*#__PURE__*/
        _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary" }) }
      ));

  }

  return (/*#__PURE__*/
    _jsxs("div", { className: "space-y-8 pb-12", children: [/*#__PURE__*/
      _jsxs("header", { children: [/*#__PURE__*/
        _jsx("h1", { className: "text-4xl font-black text-text-main tracking-tight uppercase", children: "Performance Dashboard" }), /*#__PURE__*/
        _jsx("p", { className: "text-text-muted mt-2 font-medium italic", children: "Visualize your journey to technical mastery across all modules." })] }
      ), /*#__PURE__*/


      _jsxs("div", { className: "bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-[40px] p-8 relative overflow-hidden group", children: [/*#__PURE__*/
        _jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform", children: /*#__PURE__*/
          _jsx(RefreshCw, { className: "h-32 w-32 text-blue-400" }) }
        ), /*#__PURE__*/
        _jsxs("div", { className: "relative z-10", children: [/*#__PURE__*/
          _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
            _jsx("div", { className: "p-2 bg-blue-500/20 rounded-xl", children: /*#__PURE__*/
              _jsx(RefreshCw, { className: "h-6 w-6 text-blue-400 animate-spin-slow" }) }
            ), /*#__PURE__*/
            _jsx("h2", { className: "text-2xl font-black text-text-main uppercase tracking-tight", children: "Sync Your Data Anywhere" })] }
          ), /*#__PURE__*/
          _jsxs("p", { className: "text-text-muted max-w-2xl mb-6 font-medium", children: ["Your data is stored locally on this device. Want to move your problems, notes, and roadmaps to another computer or phone? Use our ", /*#__PURE__*/
            _jsx("strong", { children: "Sync Code" }), " system to export and import everything in seconds."] }
          ), /*#__PURE__*/
          _jsxs("div", { className: "flex flex-wrap gap-4", children: [/*#__PURE__*/
            _jsxs("div", { className: "flex items-center gap-2 bg-bg-surface/50 border border-border-main px-4 py-2 rounded-2xl", children: [/*#__PURE__*/
              _jsx(Laptop, { className: "h-4 w-4 text-blue-400" }), /*#__PURE__*/
              _jsx("span", { className: "text-xs font-bold text-text-main uppercase tracking-widest", children: "Export Code" })] }
            ), /*#__PURE__*/
            _jsxs("div", { className: "flex items-center gap-2 bg-bg-surface/50 border border-border-main px-4 py-2 rounded-2xl", children: [/*#__PURE__*/
              _jsx(Smartphone, { className: "h-4 w-4 text-purple-400" }), /*#__PURE__*/
              _jsx("span", { className: "text-xs font-bold text-text-main uppercase tracking-widest", children: "Import on Device" })] }
            ), /*#__PURE__*/
            _jsx(Link, {
              to: "/sync",
              className: "ml-auto px-6 py-2 rounded-2xl bg-blue-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20", children:
              "Go to Sync Page" }

            )] }
          )] }
        )] }
      ), /*#__PURE__*/


      _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children:
        [
        { label: 'Total Problems', value: totalProblems, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Total Notes', value: totalNotes, icon: FileText, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { label: 'Roadmaps', value: totalRoadmaps, icon: MapIcon, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: 'Solved', value: solvedProblems, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }].
        map((stat, i) => /*#__PURE__*/
        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-3xl p-6 flex items-center gap-5 shadow-sm", children: [/*#__PURE__*/
          _jsx("div", { className: cn("p-4 rounded-2xl", stat.bg), children: /*#__PURE__*/
            _jsx(stat.icon, { className: cn("h-6 w-6", stat.color) }) }
          ), /*#__PURE__*/
          _jsxs("div", { children: [/*#__PURE__*/
            _jsx("div", { className: "text-3xl font-black text-text-main", children: stat.value }), /*#__PURE__*/
            _jsx("div", { className: "text-xs font-bold text-text-muted uppercase tracking-widest", children: stat.label })] }
          )] }, i
        )
        ) }
      ), /*#__PURE__*/

      _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [/*#__PURE__*/

        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-[40px] p-5 sm:p-8 shadow-sm min-w-0", children: [/*#__PURE__*/
          _jsxs("h3", { className: "text-xl font-bold text-text-main mb-8 flex items-center gap-2", children: [/*#__PURE__*/
            _jsx(TrendingUp, { className: "h-5 w-5 text-brand-primary" }), "Module Distribution"] }

          ), /*#__PURE__*/
          _jsx("div", { className: "w-full h-[350px] sm:h-[400px]", children:
            mounted && /*#__PURE__*/
            _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /*#__PURE__*/
              _jsxs(BarChart, { data: overviewData, margin: { top: 10, right: 10, left: -25, bottom: 0 }, style: { outline: 'none' }, children: [/*#__PURE__*/
                _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border-main)", vertical: false }), /*#__PURE__*/
                _jsx(XAxis, { dataKey: "name", stroke: "var(--color-text-muted)", fontSize: 12, tickLine: false, axisLine: false }), /*#__PURE__*/
                _jsx(YAxis, { stroke: "var(--color-text-muted)", fontSize: 12, tickLine: false, axisLine: false, width: 35 }), /*#__PURE__*/
                _jsx(Tooltip, {
                  cursor: { fill: 'transparent' },
                  contentStyle: { backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-main)', borderRadius: '12px' },
                  itemStyle: { color: 'var(--color-text-main)' } }
                ), /*#__PURE__*/
                _jsx(Bar, { dataKey: "value", radius: [8, 8, 0, 0], maxBarSize: 60, activeBar: false, style: { outline: 'none' }, children:
                  overviewData.map((entry, index) => /*#__PURE__*/
                  _jsx(Cell, { fill: entry.color }, `cell-${index}`)
                  ) }
                )] }
              ) }
            ) }
          )] }
        ), /*#__PURE__*/


        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-[40px] p-5 sm:p-8 shadow-sm min-w-0", children: [/*#__PURE__*/
          _jsxs("h3", { className: "text-xl font-bold text-text-main mb-8 flex items-center gap-2", children: [/*#__PURE__*/
            _jsx(Trophy, { className: "h-5 w-5 text-amber-400" }), "Problem Status"] }

          ), /*#__PURE__*/
          _jsx("div", { className: "w-full h-[350px] sm:h-[400px]", children:
            mounted && /*#__PURE__*/
            _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /*#__PURE__*/
              _jsxs(PieChart, { children: [/*#__PURE__*/
                _jsx(Pie, {
                  data: statusData,
                  cx: "50%",
                  cy: "50%",
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 5,
                  dataKey: "value", children:

                  statusData.map((entry, index) => /*#__PURE__*/
                  _jsx(Cell, { fill: entry.color }, `cell-${index}`)
                  ) }
                ), /*#__PURE__*/
                _jsx(Tooltip, {
                  contentStyle: { backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-main)', borderRadius: '12px' },
                  itemStyle: { color: 'var(--color-text-main)' } }
                )] }
              ) }
            ) }
          ), /*#__PURE__*/
          _jsx("div", { className: "flex justify-center gap-6 mt-4", children:
            statusData.map((item, i) => /*#__PURE__*/
            _jsxs("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }), /*#__PURE__*/
              _jsx("span", { className: "text-xs font-bold text-text-muted uppercase tracking-widest", children: item.name })] }, i
            )
            ) }
          )] }
        ), /*#__PURE__*/


        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-[40px] p-5 sm:p-8 shadow-sm min-w-0", children: [/*#__PURE__*/
          _jsxs("h3", { className: "text-xl font-bold text-text-main mb-8 flex items-center gap-2", children: [/*#__PURE__*/
            _jsx(Calendar, { className: "h-5 w-5 text-emerald-400" }), "Recent Activity (Last 7 Days)"] }

          ), /*#__PURE__*/
          _jsx("div", { className: "w-full h-[350px] sm:h-[400px]", children:
            mounted && /*#__PURE__*/
            _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /*#__PURE__*/
              _jsxs(AreaChart, { data: activityData, children: [/*#__PURE__*/
                _jsx("defs", { children: /*#__PURE__*/
                  _jsxs("linearGradient", { id: "colorCount", x1: "0", y1: "0", x2: "0", y2: "1", children: [/*#__PURE__*/
                    _jsx("stop", { offset: "5%", stopColor: "#00FF9C", stopOpacity: 0.3 }), /*#__PURE__*/
                    _jsx("stop", { offset: "95%", stopColor: "#00FF9C", stopOpacity: 0 })] }
                  ) }
                ), /*#__PURE__*/
                _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border-main)", vertical: false }), /*#__PURE__*/
                _jsx(XAxis, { dataKey: "date", stroke: "var(--color-text-muted)", fontSize: 12, tickLine: false, axisLine: false }), /*#__PURE__*/
                _jsx(YAxis, { stroke: "var(--color-text-muted)", fontSize: 12, tickLine: false, axisLine: false, width: 35 }), /*#__PURE__*/
                _jsx(Tooltip, {
                  contentStyle: { backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-main)', borderRadius: '12px' },
                  itemStyle: { color: 'var(--color-text-main)' } }
                ), /*#__PURE__*/
                _jsx(Area, { type: "monotone", dataKey: "count", stroke: "#00FF9C", fillOpacity: 1, fill: "url(#colorCount)", strokeWidth: 3 })] }
              ) }
            ) }
          )] }
        ), /*#__PURE__*/


        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-[40px] p-8 shadow-sm", children: [/*#__PURE__*/
          _jsxs("h3", { className: "text-xl font-bold text-text-main mb-8 flex items-center gap-2", children: [/*#__PURE__*/
            _jsx(Zap, { className: "h-5 w-5 text-brand-primary" }), "Recent Additions"] }

          ), /*#__PURE__*/
          _jsx("div", { className: "space-y-4", children:
            recentItems.length === 0 ? /*#__PURE__*/
            _jsx("p", { className: "text-text-muted text-sm italic", children: "No recent activity found." }) :

            recentItems.map((item, i) => /*#__PURE__*/
            _jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl bg-bg-main border border-border-main/50 group hover:border-brand-primary/30 transition-all", children: [/*#__PURE__*/
              _jsxs("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                _jsx("div", { className: cn("p-2 rounded-xl bg-bg-surface border border-border-main", item.color), children: /*#__PURE__*/
                  _jsx(item.icon, { className: "h-4 w-4" }) }
                ), /*#__PURE__*/
                _jsxs("div", { children: [/*#__PURE__*/
                  _jsx("div", { className: "text-sm font-bold text-text-main group-hover:text-brand-primary transition-colors", children: item.title }), /*#__PURE__*/
                  _jsx("div", { className: "text-[10px] font-bold text-text-muted uppercase tracking-widest", children: item.type })] }
                )] }
              ), /*#__PURE__*/
              _jsx("div", { className: "text-[10px] font-bold text-text-muted uppercase tracking-widest", children:
                item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now' }
              )] }, i
            )
            ) }

          )] }
        )] }
      )] }
    ));

}