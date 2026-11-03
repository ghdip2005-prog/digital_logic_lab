'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Topic, Module, DifficultyLevel } from '@/types';
import { exportAllDataPackage, importDataPackage } from '@/lib/storage';
import {
  Settings,
  Plus,
  Edit3,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  BookOpen,
  Layers,
  Cpu,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminCmsPage() {
  const {
    topics,
    modules,
    saveTopic,
    deleteTopic,
    saveModule,
    deleteModule,
    resetAllData,
    refreshData
  } = useApp();

  const [activeTab, setActiveTab] = useState<'topics' | 'modules' | 'backup'>('topics');
  const [editingTopic, setEditingTopic] = useState<Partial<Topic> | null>(null);
  const [editingModule, setEditingModule] = useState<Partial<Module> | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('All');

  // Topic form handlers
  const handleCreateNewTopic = () => {
    setEditingTopic({
      id: `topic_${Date.now()}`,
      moduleId: modules[0]?.id || 'module-2',
      slug: 'new-topic',
      title: 'New Topic Title',
      subtitle: 'Topic descriptive subtitle explaining core function.',
      difficulty: 'Beginner',
      estimatedMinutes: 20,
      order: topics.length + 1,
      isPublished: true,
      introduction: {
        definition: 'Clear formal definition of this digital logic concept.',
        importance: 'Why this concept is essential for digital circuit engineers.',
        practicalApplications: ['Microprocessor arithmetic units', 'Bus arbiters'],
        learningObjectives: ['Understand the logic truth table', 'Derive Boolean equations']
      },
      explanation: {
        stepByStep: [
          { stepTitle: '1. Basic Principles', content: 'Detailed conceptual explanation of operation.' }
        ],
        keyTakeaways: ['Key takeaway point 1', 'Key takeaway point 2']
      },
      truthTable: {
        inputs: ['A', 'B'],
        outputs: ['Y'],
        rows: [
          { inputs: [0, 0], outputs: [0], label: 'State 00' },
          { inputs: [0, 1], outputs: [0], label: 'State 01' },
          { inputs: [1, 0], outputs: [0], label: 'State 10' },
          { inputs: [1, 1], outputs: [1], label: 'State 11' }
        ]
      },
      booleanExpression: {
        primaryExpression: 'Y = A · B',
        sopForm: 'Y = A · B',
        derivationSteps: [
          { step: 1, title: 'Truth table row analysis', explanation: 'Only row 11 generates output 1.', equation: 'Y = A · B' }
        ]
      },
      circuitDiagram: {
        type: 'basic-gate',
        inputs: [
          { id: 'in_a', name: 'Input A', defaultValue: 0 },
          { id: 'in_b', name: 'Input B', defaultValue: 0 }
        ],
        outputs: [
          { id: 'out_y', name: 'Output Y', logicExpr: 'A && B' }
        ],
        gates: [
          { id: 'g1', type: 'AND', label: 'AND Gate', inputs: ['in_a', 'in_b'], output: 'out_y' }
        ]
      },
      hardwareImplementation: {
        requiredComponents: [
          { name: 'IC 7408', quantity: 1 },
          { name: '330Ω Resistor', quantity: 1 },
          { name: 'LED', quantity: 1 }
        ],
        icNumbers: ['7408'],
        supplyVoltage: '5.0V DC (TTL)',
        powerConsiderations: 'Supply +5V to Pin 14 and 0V to Pin 7.',
        breadboardWiringSteps: [
          '1. Place IC 7408 on breadboard.',
          '2. Connect Pin 14 to +5V and Pin 7 to GND.'
        ],
        exactPinConnections: [
          { from: 'Switch A', to: 'Pin 1' },
          { from: 'Switch B', to: 'Pin 2' },
          { from: 'Pin 3', to: 'LED' }
        ],
        testingProcedure: ['Test 00, 01, 10, 11 combinations.'],
        expectedOutput: 'LED lights up for valid combination.',
        commonMistakesAndTroubleshooting: [
          { mistake: 'Floating input', solution: 'Add pull-down resistor.' }
        ]
      },
      practiceProblems: [
        {
          id: `p_${Date.now()}`,
          question: 'What is the output for inputs 1 and 1?',
          type: 'mcq',
          difficulty: 'Beginner',
          options: ['1', '0'],
          correctAnswer: 0,
          explanation: 'Logical AND of 1 and 1 is 1.'
        }
      ]
    });
  };

  const handleSaveTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic || !editingTopic.title || !editingTopic.slug) return;
    saveTopic(editingTopic as Topic);
    setEditingTopic(null);
  };

  // Module form handlers
  const handleCreateNewModule = () => {
    setEditingModule({
      id: `module_${Date.now()}`,
      slug: 'new-module',
      title: 'New Module Title',
      description: 'Comprehensive curriculum overview of this module subject matter.',
      iconName: 'Cpu',
      order: modules.length + 1,
      estimatedHours: 6
    });
  };

  const handleSaveModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editingModule.title || !editingModule.slug) return;
    saveModule(editingModule as Module);
    setEditingModule(null);
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllDataPackage();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital_logic_lab_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportSubmit = () => {
    const res = importDataPackage(importJsonText);
    setImportStatus(res.message);
    if (res.success) {
      refreshData();
    }
  };

  const filteredTopics = topics.filter(t => selectedModuleFilter === 'All' || t.moduleId === selectedModuleFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Content Management System</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Curriculum & Platform Administration
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'topics'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Topics ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Modules ({modules.length})
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Backup & Export
          </button>
        </div>
      </div>

      {/* TOPICS TAB */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase text-slate-400">Filter by Module:</span>
              <select
                value={selectedModuleFilter}
                onChange={e => setSelectedModuleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All">All Modules</option>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreateNewTopic}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dynamic Topic</span>
            </button>
          </div>

          {/* Topics Table */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Topic Title & Subtitle</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {filteredTopics.map((t, idx) => {
                  const parentMod = modules.find(m => m.id === t.moduleId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          /course/{parentMod?.slug}/{t.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {parentMod?.title || t.moduleId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {t.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{t.estimatedMinutes} min</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          t.isPublished ? 'text-emerald-500' : 'text-slate-400'
                        }`}>
                          {t.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{t.isPublished ? 'Published' : 'Draft'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingTopic(t)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                            title="Edit Topic"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete topic "${t.title}"?`)) {
                                deleteTopic(t.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Topic"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULES TAB */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleCreateNewModule}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Module</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(m => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    Module {m.order}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingModule(m)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete module "${m.title}"?`)) {
                          deleteModule(m.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.description}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  Estimated: {m.estimatedHours} hours • Slug: {m.slug}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BACKUP & RESTORE TAB */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Curriculum Data Backup & Export
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export all modules, topics, truth tables, IC specs, laboratory worksheets, and quiz questions as a portable JSON package.
            </p>
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Curriculum Backup (JSON)</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Import Curriculum JSON Package
            </h2>
            <textarea
              rows={5}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Paste valid backup JSON data here..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-hidden"
            />
            {importStatus && (
              <p className="text-xs font-semibold text-cyan-500">{importStatus}</p>
            )}
            <button
              onClick={handleImportSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Apply Imported Data</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Factory Reset Platform Data</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Reset all custom topics, modules, and quiz scores back to the factory initial seed data.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all curriculum data to initial defaults?')) {
                  resetAllData();
                  alert('Reset successfully completed.');
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              Reset to Factory Seed Data
            </button>
          </div>
        </div>
      )}

      {/* TOPIC EDIT / CREATE MODAL */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingTopic.id ? 'Edit Dynamic Topic' : 'Create New Topic'}
              </h2>
              <button
                onClick={() => setEditingTopic(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTopicSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Topic Title</label>
                  <input
                    type="text"
                    required
                    value={editingTopic.title || ''}
                    onChange={e => setEditingTopic({ ...editingTopic, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingTopic.slug || ''}
                    onChange={e => setEditingTopic({ ...editingTopic, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingTopic.subtitle || ''}
                  onChange={e => setEditingTopic({ ...editingTopic, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Module</label>
                  <select
                    value={editingTopic.moduleId || ''}
                    onChange={e => setEditingTopic({ ...editingTopic, moduleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Difficulty</label>
                  <select
                    value={editingTopic.difficulty || 'Beginner'}
                    onChange={e => setEditingTopic({ ...editingTopic, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Estimated Minutes</label>
                  <input
                    type="number"
                    value={editingTopic.estimatedMinutes || 20}
                    onChange={e => setEditingTopic({ ...editingTopic, estimatedMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Formal Definition (Section A)</label>
                <textarea
                  rows={3}
                  value={editingTopic.introduction?.definition || ''}
                  onChange={e => setEditingTopic({
                    ...editingTopic,
                    introduction: {
                      ...(editingTopic.introduction || { definition: '', importance: '', practicalApplications: [], learningObjectives: [] }),
                      definition: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={editingTopic.isPublished ?? true}
                  onChange={e => setEditingTopic({ ...editingTopic, isPublished: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="pub-check" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Published and available in student course navigation
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Save & Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODULE EDIT / CREATE MODAL */}
      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingModule.id ? 'Edit Module' : 'Create Module'}
            </h2>
            <form onSubmit={handleSaveModuleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={editingModule.title || ''}
                  onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Module Slug</label>
                <input
                  type="text"
                  required
                  value={editingModule.slug || ''}
                  onChange={e => setEditingModule({ ...editingModule, slug: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingModule.description || ''}
                  onChange={e => setEditingModule({ ...editingModule, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
