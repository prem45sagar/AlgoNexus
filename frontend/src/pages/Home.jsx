import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {

  BookOpen,
  Map,
  ArrowRight,


  Sparkles,
  Target,
  Layout as LayoutIcon,
  Zap,
  Users,
  Trophy,
  ArrowUpRight,
  MousePointer2 } from
'lucide-react';import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";


export default function Home() {
  return (/*#__PURE__*/
    _jsxs("div", { className: "space-y-32 pb-32 overflow-hidden", children: [/*#__PURE__*/

      _jsxs("section", { className: "relative pt-20 min-h-[80vh] flex flex-col items-center justify-center text-center px-4", children: [/*#__PURE__*/

        _jsxs("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10", children: [/*#__PURE__*/
          _jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full animate-pulse" }), /*#__PURE__*/
          _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" })] }
        ), /*#__PURE__*/

        _jsxs(motion.div, {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
          className: "max-w-5xl mx-auto space-y-12", children: [/*#__PURE__*/

          _jsxs("h1", { className: "text-6xl md:text-[120px] font-black tracking-tighter text-text-main leading-[0.85] uppercase", children: ["Your Journey. ", /*#__PURE__*/
            _jsx("br", {}), /*#__PURE__*/
            _jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-400 to-emerald-400", children: "Your Code." }

            )] }
          ), /*#__PURE__*/

          _jsx("p", { className: "text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed font-medium", children: "AlgoNexus is your personal knowledge engine. We provide the tools, you provide the grit. Organize your problems, document your insights, and build a legacy of technical mastery." }


          ), /*#__PURE__*/

          _jsxs("div", { className: "flex flex-wrap items-center justify-center gap-6 pt-4", children: [/*#__PURE__*/
            _jsxs(Link, {
              to: "/problems",
              className: "px-8 py-4 rounded-full bg-brand-primary text-slate-950 font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,156,0.3)] flex items-center gap-2 group active:scale-95", children: [
              "Start Building", /*#__PURE__*/

              _jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })] }
            ), /*#__PURE__*/
            _jsx(Link, {
              to: "/roadmaps",
              className: "px-8 py-4 rounded-full bg-bg-surface text-text-main font-black text-sm uppercase tracking-widest border border-border-main hover:bg-bg-surface/80 transition-all active:scale-95", children:
              "Explore Paths" }

            )] }
          )] }
        ), /*#__PURE__*/


        _jsx("div", { className: "mt-24 flex flex-wrap justify-center gap-16 md:gap-24", children:
          [
          { label: "Problems", value: "500+", icon: Target },
          { label: "Roadmaps", value: "24", icon: Map },
          { label: "Users", value: "10k+", icon: Users },
          { label: "Success", value: "98%", icon: Trophy }].
          map((stat, i) => /*#__PURE__*/
          _jsxs("div", { className: "flex items-center gap-4 group", children: [/*#__PURE__*/
            _jsx("div", { className: "p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-500", children: /*#__PURE__*/
              _jsx(stat.icon, { className: "h-6 w-6 text-brand-primary group-hover:text-slate-950 transition-colors" }) }
            ), /*#__PURE__*/
            _jsxs("div", { className: "text-left", children: [/*#__PURE__*/
              _jsx("div", { className: "text-2xl md:text-3xl font-black text-text-main leading-none tracking-tighter", children: stat.value }), /*#__PURE__*/
              _jsx("div", { className: "text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-[0.2em] mt-1", children: stat.label })] }
            )] }, i
          )
          ) }
        )] }
      ), /*#__PURE__*/


      _jsx("section", { className: "max-w-7xl mx-auto px-4", children: /*#__PURE__*/
        _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-16 relative", children: [/*#__PURE__*/

          _jsx("div", { className: "hidden md:block absolute top-[150px] left-0 w-full h-px bg-slate-800 -z-10" }),

          [
          {
            step: "01",
            title: "Organize",
            desc: "Import problems from LeetCode or add your own. Categorize them into custom folders with intelligent status tracking.",
            img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
          },
          {
            step: "02",
            title: "Document",
            desc: "Don't just solve—understand. Write deep-dive notes, store multiple approaches, and save optimized code snippets.",
            img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
          },
          {
            step: "03",
            title: "Master",
            desc: "Build your own learning strategy. Track your progress across every problem and visualize your growth with interactive analytics.",
            img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
          }].
          map((item, i) => /*#__PURE__*/
          _jsxs(motion.div, {

            initial: { opacity: 0, y: 40 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.2, duration: 0.8 },
            className: "group", children: [/*#__PURE__*/

            _jsxs("div", { className: "mb-10 aspect-[4/3] rounded-2xl overflow-hidden border border-border-main group-hover:border-brand-primary/30 transition-all duration-700 relative", children: [/*#__PURE__*/
              _jsx("img", {
                src: item.img,
                alt: item.title,
                className: "w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700",
                referrerPolicy: "no-referrer" }
              ), /*#__PURE__*/
              _jsx("div", { className: "absolute inset-0 bg-bg-main/20 group-hover:bg-transparent transition-colors" })] }
            ), /*#__PURE__*/
            _jsxs("div", { className: "space-y-4", children: [/*#__PURE__*/
              _jsxs("div", { className: "flex items-baseline gap-4", children: [/*#__PURE__*/
                _jsx("span", { className: "text-6xl font-black text-text-main/5 group-hover:text-brand-primary/20 transition-colors duration-500 font-mono italic", children:
                  item.step }
                ), /*#__PURE__*/
                _jsx("h3", { className: "text-3xl font-black text-text-main uppercase tracking-tighter", children: item.title })] }
              ), /*#__PURE__*/
              _jsx("p", { className: "text-text-muted leading-relaxed text-sm font-medium", children:
                item.desc }
              )] }
            )] }, i
          )
          )] }
        ) }
      ), /*#__PURE__*/


      _jsx("section", { className: "max-w-6xl mx-auto px-4", children: /*#__PURE__*/
        _jsxs("div", { className: "bg-bg-surface border border-border-main rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-sm", children: [/*#__PURE__*/
          _jsx("div", { className: "absolute top-0 right-0 p-8 opacity-10", children: /*#__PURE__*/
            _jsx(MousePointer2, { className: "h-32 w-32 text-brand-primary" }) }
          ), /*#__PURE__*/

          _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", children: [/*#__PURE__*/
            _jsxs("div", { className: "space-y-8", children: [/*#__PURE__*/
              _jsxs("h2", { className: "text-4xl md:text-5xl font-black text-text-main tracking-tighter leading-tight uppercase", children: ["Take Command of ", /*#__PURE__*/
                _jsx("br", {}), /*#__PURE__*/
                _jsx("span", { className: "text-brand-primary", children: "Your Growth" })] }
              ), /*#__PURE__*/
              _jsx("p", { className: "text-text-muted text-lg leading-relaxed font-medium", children: "AlgoNexus isn't a passive platform. It's an active workspace where you build your own technical library. Here's what you can do:" }

              ), /*#__PURE__*/

              _jsx("div", { className: "grid grid-cols-1 gap-4", children:
                [
                { title: "Import & Sync", desc: "Instantly pull problems from LeetCode with full descriptions and constraints.", icon: ArrowUpRight },
                { title: "Rich Documentation", desc: "Use our Markdown editor to write beautiful, code-rich notes for every solution.", icon: BookOpen },
                { title: "Custom Organization", desc: "Create folders with custom icons to categorize problems by pattern or difficulty.", icon: LayoutIcon },
                { title: "Progress Visualization", desc: "See your growth through interactive charts and status heatmaps.", icon: Zap }].
                map((feature, i) => /*#__PURE__*/
                _jsxs("div", { className: "flex items-start gap-4 p-4 rounded-2xl hover:bg-bg-main/50 transition-colors group", children: [/*#__PURE__*/
                  _jsx("div", { className: "mt-1 p-2 rounded-lg bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-slate-950 transition-all", children: /*#__PURE__*/
                    _jsx(feature.icon, { className: "h-4 w-4" }) }
                  ), /*#__PURE__*/
                  _jsxs("div", { children: [/*#__PURE__*/
                    _jsx("h4", { className: "text-text-main font-bold text-sm uppercase tracking-wider", children: feature.title }), /*#__PURE__*/
                    _jsx("p", { className: "text-text-muted text-sm mt-1", children: feature.desc })] }
                  )] }, i
                )
                ) }
              )] }
            ), /*#__PURE__*/

            _jsxs("div", { className: "relative", children: [/*#__PURE__*/
              _jsx("div", { className: "absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full -z-10" }), /*#__PURE__*/
              _jsxs("div", { className: "rounded-3xl border border-border-main overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500", children: [/*#__PURE__*/
                _jsx("img", {
                  src: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=1200",
                  alt: "User Workspace",
                  className: "w-full aspect-square object-cover",
                  referrerPolicy: "no-referrer" }
                ), /*#__PURE__*/
                _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-bg-main via-transparent to-transparent" }), /*#__PURE__*/
                _jsxs("div", { className: "absolute bottom-6 left-6 right-6 p-6 bg-bg-surface/80 backdrop-blur-md border border-border-main rounded-2xl", children: [/*#__PURE__*/
                  _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [/*#__PURE__*/
                    _jsx("div", { className: "w-2 h-2 rounded-full bg-brand-primary animate-pulse" }), /*#__PURE__*/
                    _jsx("span", { className: "text-[10px] font-black text-text-main uppercase tracking-[0.2em]", children: "Live Workspace" })] }
                  ), /*#__PURE__*/
                  _jsx("p", { className: "text-xs text-text-muted font-medium italic", children: "\"I used to have notes scattered everywhere. Now, my entire DSA journey is in one place, organized exactly how I think.\"" }

                  ), /*#__PURE__*/
                  _jsx("div", { className: "mt-4 text-[10px] font-bold text-text-muted uppercase tracking-widest", children: "\u2014 Sarah K., Software Engineer" })] }
                )] }
              )] }
            )] }
          )] }
        ) }
      ), /*#__PURE__*/


      _jsx("section", { className: "max-w-7xl mx-auto px-4", children: /*#__PURE__*/
        _jsxs("div", { className: "relative rounded-[40px] bg-brand-primary p-12 md:p-24 overflow-hidden text-center group", children: [/*#__PURE__*/
          _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-brand-primary to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700" }), /*#__PURE__*/

          _jsxs(motion.div, {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "relative z-10 space-y-8", children: [/*#__PURE__*/

            _jsxs("h2", { className: "text-4xl md:text-7xl font-black text-slate-950 tracking-tighter leading-tight uppercase", children: ["Stop Solving. ", /*#__PURE__*/
              _jsx("br", {}), "Start Mastering."] }

            ), /*#__PURE__*/
            _jsx("p", { className: "text-slate-950/70 text-lg md:text-xl max-w-2xl mx-auto font-bold uppercase tracking-tight", children: "Join the community of developers who are building their own paths to the world's top tech companies." }

            ), /*#__PURE__*/
            _jsx("div", { className: "pt-4", children: /*#__PURE__*/
              _jsxs(Link, {
                to: "/problems",
                className: "px-8 py-4 md:px-12 md:py-6 rounded-full bg-slate-950 text-brand-primary font-black text-sm md:text-xl hover:scale-105 transition-all shadow-2xl shadow-black/20 inline-flex items-center gap-3 active:scale-95 uppercase tracking-widest", children: [
                "Launch Your Workspace", /*#__PURE__*/

                _jsx(ArrowRight, { className: "h-5 w-5 md:h-7 md:w-7" })] }
              ) }
            )] }
          )] }
        ) }
      )] }

    ));

}