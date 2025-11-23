
import React, { useState } from 'react';
import { X, Sparkles, Database } from 'lucide-react';
import { Button } from './Button';
import { TaskType } from '../types';
import { generateDatasetDescription } from '../services/geminiService';

interface CreateDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export const CreateDatasetModal: React.FC<CreateDatasetModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [task, setTask] = useState<TaskType>(TaskType.NLP);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!name) return;
    setIsGenerating(true);
    const desc = await generateDatasetDescription(name, task, "Contains rows of text and labels");
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      task,
      description,
      owner: 'currentUser',
      downloads: 0,
      likes: 0,
      updatedAt: 'Just now',
      tags: [task.split(' ')[0].toLowerCase(), 'new'],
      size: '0 KB',
      license: 'MIT',
      id: `new-${Date.now()}`,
      modality: 'Text',
      format: 'json',
      numRows: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Create New Dataset</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dataset Name</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="e.g., sentiment-analysis-v2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Category</label>
            <select 
              value={task}
              onChange={(e) => setTask(e.target.value as TaskType)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
            >
              {Object.values(TaskType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <button 
                type="button"
                onClick={handleGenerateDescription}
                disabled={!name || isGenerating}
                className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
              >
                <Sparkles size={14} className="mr-1" />
                {isGenerating ? 'Thinking...' : 'Auto-generate'}
              </button>
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
              placeholder="Describe your dataset..."
            />
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="button" variant="primary" onClick={handleSubmit} disabled={!name}>
              Create Dataset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
