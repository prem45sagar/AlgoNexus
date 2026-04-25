import {
  Folder, Book, Code, Database, Terminal, Cpu, Globe,
  Layout, Server, Star, Bookmark, Briefcase, Hash,
  Lightbulb, Target, Zap, Shield, Box, Layers } from
'lucide-react';
import React from 'react';import { jsx as _jsx } from "react/jsx-runtime";

export const FOLDER_ICONS = {
  Folder, Book, Code, Database, Terminal, Cpu, Globe,
  Layout, Server, Star, Bookmark, Briefcase, Hash,
  Lightbulb, Target, Zap, Shield, Box, Layers
};



export const AVAILABLE_ICONS = Object.keys(FOLDER_ICONS);

export const getIconComponent = (iconName) => {
  if (!iconName || !(iconName in FOLDER_ICONS)) {
    return Folder;
  }
  return FOLDER_ICONS[iconName];
};

export const IconPicker = ({
  selected,
  onSelect



}) => {
  return (/*#__PURE__*/
    _jsx("div", { className: "grid grid-cols-6 gap-2 p-2 bg-bg-main rounded-lg border border-border-main", children:
      AVAILABLE_ICONS.map((iconKey) => {
        const Icon = FOLDER_ICONS[iconKey];
        const isSelected = selected === iconKey || !selected && iconKey === 'Folder';
        return (/*#__PURE__*/
          _jsx("button", {

            type: "button",
            onClick: () => onSelect(iconKey),
            className: `p-2 rounded-md flex items-center justify-center transition-colors ${
            isSelected ?
            'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
            'text-text-muted hover:bg-bg-surface hover:text-text-main border border-transparent'}`,

            title: iconKey, children: /*#__PURE__*/

            _jsx(Icon, { className: "h-5 w-5" }) }, iconKey
          ));

      }) }
    ));

};