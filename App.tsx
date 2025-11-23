
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, LayoutGrid, List as ListIcon, Bell, ChevronRight, Home, Database, Settings, Heart, Download, FileText, File, Copy, Eye, GitBranch, History, Shield, Folder, Image as ImageIcon, Mic, Video, Table, Box, Check } from 'lucide-react';
import { Dataset, TaskType, ViewState, DatasetFile } from './types';
import { Button } from './components/Button';
import { DatasetCard } from './components/DatasetCard';
import { CreateDatasetModal } from './components/CreateDatasetModal';
import { generateDatasetDescription } from './services/geminiService';

// Mock Data
const MOCK_DATASETS: Dataset[] = [
  {
    id: '1',
    owner: 'moonshotai',
    name: 'Kimi-K2-Thinking',
    description: 'A reasoning model dataset consisting of extensive thought chains and validated outputs.',
    task: TaskType.NLP,
    downloads: 154200,
    likes: 4300,
    updatedAt: '2 days ago',
    tags: ['text-generation', 'transformers', 'safetensors', 'conversational'],
    size: '594 GB',
    license: 'modified-mit',
    modality: 'Text',
    format: 'safetensors',
    numRows: 10000000
  },
  {
    id: '2',
    owner: 'openai',
    name: 'gsm8k',
    description: 'GSM8K is a dataset of 8.5K high quality linguistically diverse grade school math word problems.',
    task: TaskType.NLP,
    downloads: 89000,
    likes: 3200,
    updatedAt: '1 week ago',
    tags: ['math', 'reasoning', 'chain-of-thought'],
    size: '12 MB',
    license: 'MIT',
    modality: 'Text',
    format: 'json',
    numRows: 8500
  },
  {
    id: '3',
    owner: 'mozilla-foundation',
    name: 'common-voice-13',
    description: 'A massive multilingual dataset of varied voice clips for speech recognition training.',
    task: TaskType.AUDIO,
    downloads: 56000,
    likes: 1200,
    updatedAt: '3 days ago',
    tags: ['audio', 'speech-to-text', 'multilingual'],
    size: '80 GB',
    license: 'CC0',
    modality: 'Audio',
    format: 'mp3',
    numRows: 500000
  },
  {
    id: '4',
    owner: 'stanford',
    name: 'alpaca-clean',
    description: 'A clean version of the Alpaca dataset for instruction tuning LLMs.',
    task: TaskType.NLP,
    downloads: 210000,
    likes: 8900,
    updatedAt: '5 hours ago',
    tags: ['instruction-tuning', 'llm', 'text'],
    size: '45 MB',
    license: 'Apache 2.0',
    modality: 'Text',
    format: 'json',
    numRows: 52000
  },
  {
    id: '5',
    owner: 'microsoft',
    name: 'coco-2017',
    description: 'COCO is a large-scale object detection, segmentation, and captioning dataset.',
    task: TaskType.CV,
    downloads: 340000,
    likes: 12500,
    updatedAt: '1 month ago',
    tags: ['object-detection', 'segmentation'],
    size: '18 GB',
    license: 'Custom',
    modality: 'Image',
    format: 'imagefolder',
    numRows: 123000
  }
];

const MOCK_FILES: DatasetFile[] = [
  { name: 'docs', size: '-', type: 'folder', date: '14 days ago', commitMessage: 'Fix args in SGLang launch command (#9)', commitHash: '6126819' },
  { name: 'figures', size: '-', type: 'folder', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'a1b2c3d' },
  { name: '.gitattributes', size: '1.85 kB', type: 'file', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'e5f6g7h', tags: ['Safe'] },
  { name: 'LICENSE', size: '1.46 kB', type: 'file', date: '14 days ago', commitMessage: 'Update LICENSE', commitHash: '9i8j7k6', tags: ['Safe'] },
  { name: 'README.md', size: '16.2 kB', type: 'file', date: '14 days ago', commitMessage: 'Update README.md', commitHash: '5l4m3n2', tags: ['Safe'] },
  { name: 'THIRD_PARTY_NOTICES.md', size: '1.67 kB', type: 'file', date: '15 days ago', commitMessage: 'update', commitHash: 'k9l8m7n', tags: ['Safe'] },
  { name: 'chat_template.jinja', size: '3.45 kB', type: 'file', date: '13 days ago', commitMessage: 'fix-default-system-prompt (#12)', commitHash: 'x1y2z3a', tags: ['Safe'] },
  { name: 'config.json', size: '3.83 kB', type: 'json', date: '15 days ago', commitMessage: 'update', commitHash: '1o2p3q4', tags: ['Safe'] },
  { name: 'configuration_deepseek.py', size: '10.7 kB', type: 'file', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'b5c6d7e', tags: ['Safe'] },
  { name: 'generation_config.json', size: '53 Bytes', type: 'json', date: '15 days ago', commitMessage: 'update', commitHash: 'f8g9h0i', tags: ['Safe'] },
  { name: 'model-00001-of-000062.safetensors', size: '995 MB', type: 'file', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'r5s6t7u', tags: ['Safe', 'LFS'] },
  { name: 'model-00002-of-000062.safetensors', size: '9.81 GB', type: 'file', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'v8w9x0y', tags: ['Safe', 'LFS'] },
  { name: 'model-00003-of-000062.safetensors', size: '9.81 GB', type: 'file', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'z1a2b3c', tags: ['Safe', 'LFS'] },
  { name: 'model-00004-of-000062.safetensors', size: '9.81 GB', type: 'file', date: '17 days ago', commitMessage: 'initial commit', commitHash: 'd4e5f6g', tags: ['Safe', 'LFS'] },
];

// Filter Constants
const MODALITY_OPTIONS = [
  { id: 'Text', label: 'Text', icon: FileText },
  { id: 'Image', label: 'Image', icon: ImageIcon },
  { id: 'Audio', label: 'Audio', icon: Mic },
  { id: 'Video', label: 'Video', icon: Video },
  { id: 'Tabular', label: 'Tabular', icon: Table },
  { id: '3D', label: '3D', icon: Box },
];

const FORMAT_OPTIONS = ['json', 'csv', 'parquet', 'arrow', 'safetensors', 'imagefolder', 'mp3'];

const SIZE_LABELS = [
  { label: '1k', value: 1000 },
  { label: '10k', value: 10000 },
  { label: '100k', value: 100000 },
  { label: '1M', value: 1000000 },
  { label: '10M', value: 10000000 },
  { label: '1B', value: 1000000000 },
];

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filters State
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [minRows, setMinRows] = useState<number>(0);

  // Detail View Tabs
  const [activeTab, setActiveTab] = useState<'card' | 'files' | 'community'>('card');

  const filteredDatasets = useMemo(() => {
    return datasets.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTask = selectedTasks.length === 0 || selectedTasks.includes(d.task);
      const matchesModality = selectedModalities.length === 0 || selectedModalities.includes(d.modality);
      const matchesFormat = selectedFormats.length === 0 || selectedFormats.includes(d.format);
      const matchesSize = d.numRows >= minRows;

      return matchesSearch && matchesTask && matchesModality && matchesFormat && matchesSize;
    });
  }, [datasets, searchQuery, selectedTasks, selectedModalities, selectedFormats, minRows]);

  const handleCreateDataset = (newDataset: Dataset) => {
    setDatasets([newDataset, ...datasets]);
  };

  const toggleFilter = <T,>(item: T, current: T[], setter: (val: T[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter(i => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(0) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 h-16 glass z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => {
            setViewState(ViewState.LIST);
            setSelectedDataset(null);
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
            D
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">DataHub</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="text-gray-900">Datasets</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Models</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Spaces</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Docs</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search datasets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all outline-none text-sm"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
           <img src="https://picsum.photos/100/100" alt="User" />
        </div>
      </div>
    </header>
  );

  const renderListView = () => (
    <main className="pt-24 px-6 pb-10 max-w-[1600px] mx-auto">
      {/* Hero / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Datasets</h1>
          <p className="text-gray-500">Discover, download, and share open-source data.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>New Dataset</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] lg:overflow-y-auto pb-10 scrollbar-hide">
          
          {/* Tasks */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Task</h3>
            <div className="space-y-2">
              {Object.values(TaskType).map((task) => (
                <label key={task} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedTasks.includes(task) ? 'bg-black border-black' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
                    {selectedTasks.includes(task) && <Check size={10} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedTasks.includes(task)} 
                    onChange={() => toggleFilter(task, selectedTasks, setSelectedTasks)} 
                  />
                  <span className={`text-sm ${selectedTasks.includes(task) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{task}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modalities */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Modalities</h3>
            <div className="grid grid-cols-2 gap-2">
              {MODALITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleFilter(opt.id, selectedModalities, setSelectedModalities)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-xs font-medium transition-all ${
                    selectedModalities.includes(opt.id) 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <opt.icon size={14} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size (rows) */}
          <div>
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Size (rows)</h3>
             <div className="px-1">
               <input 
                  type="range" 
                  min="0" 
                  max={SIZE_LABELS.length - 1} 
                  step="1" 
                  value={SIZE_LABELS.findIndex(l => l.value === minRows) === -1 ? 0 : SIZE_LABELS.findIndex(l => l.value === minRows)}
                  onChange={(e) => setMinRows(SIZE_LABELS[parseInt(e.target.value)]?.value || 0)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
               />
               <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-mono">
                  {SIZE_LABELS.map((l, i) => (
                     i % 2 === 0 && <span key={l.label} onClick={() => setMinRows(l.value)} className="cursor-pointer hover:text-gray-600">{l.label}</span>
                  ))}
               </div>
               <div className="mt-2 text-xs font-medium text-gray-700 text-center bg-gray-100 py-1 rounded">
                  {minRows === 0 ? 'Any size' : `> ${formatNumber(minRows)} rows`}
               </div>
             </div>
          </div>

          {/* Format */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Format</h3>
            <div className="flex flex-wrap gap-1.5">
              {FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => toggleFilter(fmt, selectedFormats, setSelectedFormats)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedFormats.includes(fmt)
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Grid */}
        <div className="flex-1 w-full">
           {/* Results Count */}
           <div className="mb-4 flex items-center justify-between">
             <span className="text-sm text-gray-500 font-medium">{filteredDatasets.length} datasets</span>
             <div className="lg:hidden">
                <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filters</Button>
             </div>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDatasets.map(dataset => (
              <DatasetCard 
                key={dataset.id} 
                dataset={dataset} 
                onClick={(d) => {
                  setSelectedDataset(d);
                  setViewState(ViewState.DETAIL);
                  window.scrollTo(0,0);
                }} 
              />
            ))}
          </div>
          
          {filteredDatasets.length === 0 && (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm border border-gray-100">
                <Database size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">No datasets found</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSelectedTasks([]);
                  setSelectedModalities([]);
                  setSelectedFormats([]);
                  setMinRows(0);
                  setSearchQuery('');
                }}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );

  const renderDetailView = () => {
    if (!selectedDataset) return null;
    
    return (
      <main className="pt-20 min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => setViewState(ViewState.LIST)}>Datasets</span>
            <ChevronRight size={14} />
            <span className="hover:text-gray-900 cursor-pointer">{selectedDataset.owner}</span>
            <ChevronRight size={14} />
            <span className="font-medium text-gray-900">{selectedDataset.name}</span>
          </div>
        </div>

        {/* Header Info */}
        <div className="px-6 py-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedDataset.name}</h1>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                      {selectedDataset.task}
                    </span>
                    <span className="px-2 py-1 bg-white text-gray-500 text-xs font-medium rounded-md border border-gray-200 flex items-center gap-1">
                      <Heart size={10} /> {selectedDataset.likes.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 max-w-2xl mb-4 leading-relaxed">{selectedDataset.description}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDataset.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs border border-gray-200">
                        {tag}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-xs border border-gray-100 ml-2">
                       License: {selectedDataset.license}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-3">
                   <div className="flex gap-2">
                      <Button variant="secondary" size="sm" icon={<Copy size={14} />}>
                        {selectedDataset.name}
                      </Button>
                      <Button variant="primary" size="sm" className="bg-black text-white" icon={<Download size={14} />}>
                        Use this dataset
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6">
           <div className="max-w-7xl mx-auto flex gap-8">
              <button 
                onClick={() => setActiveTab('card')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'card' ? 'border-orange-400 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                <FileText size={16} /> Dataset card
              </button>
              <button 
                onClick={() => setActiveTab('files')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'files' ? 'border-orange-400 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                <Database size={16} /> Files and versions
              </button>
              <button 
                onClick={() => setActiveTab('community')}
                className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'community' ? 'border-orange-400 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                 <Settings size={16} /> Community
                 <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">32</span>
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 max-w-7xl mx-auto">
           
           {/* Main Content */}
           <div className="w-full">
              {activeTab === 'card' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                   <div className="lg:col-span-3 space-y-6">
                     <div className="prose prose-gray max-w-none">
                       {/* Mock Markdown Content */}
                       <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                         <h2 className="text-2xl font-bold text-gray-900 mb-4">Dataset Card for {selectedDataset.name}</h2>
                         <p className="text-gray-600 mb-6">
                           This dataset serves as a benchmark for <strong>{selectedDataset.task}</strong> tasks. 
                           It has been curated by {selectedDataset.owner} and contains high-quality samples.
                         </p>
                         
                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Structure</h3>
                         <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 font-mono text-sm text-gray-700 overflow-x-auto">
                           {`{
    "id": "string",
    "text": "string",
    "label": "integer",
    "metadata": {
      "source": "string",
      "timestamp": "date"
    }
  }`}
                         </div>
                         
                         <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Citation</h3>
                         <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600">
                           @article{`{${selectedDataset.name}_2024,
    title={${selectedDataset.name}: A New Benchmark},
    author={${selectedDataset.owner}},
    year={2024}
  }`}
                         </blockquote>
                       </div>
                     </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                       <h3 className="font-semibold text-gray-900 mb-4">Downloads</h3>
                       <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">{selectedDataset.downloads.toLocaleString()}</span>
                          <span className="text-sm text-green-600 font-medium">+12%</span>
                       </div>
                       <p className="text-xs text-gray-400">Last 30 days</p>
                       
                       {/* Mock Chart Bar */}
                       <div className="flex items-end gap-1 h-12 mt-4">
                          {[40, 60, 45, 70, 90, 65, 80, 50, 75, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-100 rounded-sm hover:bg-blue-200 transition-colors" style={{ height: `${h}%` }}></div>
                          ))}
                       </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                       <h3 className="font-semibold text-gray-900 mb-4">Metadata</h3>
                       <div className="space-y-4">
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">License</span>
                            <p className="text-sm text-gray-900 font-medium">{selectedDataset.license}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Size</span>
                            <p className="text-sm text-gray-900 font-medium">{selectedDataset.size}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Language</span>
                            <p className="text-sm text-gray-900 font-medium">English (en)</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b border-gray-100 bg-gray-50/50 gap-4">
                     <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 cursor-pointer hover:border-gray-400 transition-colors shadow-sm">
                           <GitBranch size={14} className="text-gray-500 mr-2" />
                           <span className="font-medium text-gray-700 mr-1">main</span>
                           <ChevronRight size={12} className="text-gray-400 rotate-90" />
                        </div>
                        <div className="flex items-center text-gray-500 gap-1 font-mono text-sm hidden sm:flex">
                           <span className="hover:underline cursor-pointer font-semibold text-gray-700">{selectedDataset.name}</span>
                           <span className="text-gray-300">/</span>
                           <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500 border border-gray-200">{selectedDataset.size}</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="relative hidden lg:block">
                           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                           <input
                             type="text"
                             placeholder="Go to file"
                             className="pl-9 pr-16 py-1.5 text-sm rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-48 transition-all"
                           />
                           <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <kbd className="hidden sm:inline-block min-h-[20px] px-1.5 bg-gray-50 border border-gray-200 rounded text-[10px] text-gray-400 font-mono leading-4">Ctrl+K</kbd>
                           </div>
                        </div>
                        
                        <div className="h-4 w-px bg-gray-300 hidden md:block"></div>

                        <div className="flex items-center -space-x-2 hidden md:flex">
                           {[1,2,3].map(i => (
                              <img key={i} src={`https://picsum.photos/seed/${i}/32/32`} className="w-6 h-6 rounded-full border-2 border-white ring-1 ring-gray-100" />
                           ))}
                           <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 ring-1 ring-gray-100">+7</div>
                        </div>

                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                           <History size={14} className="text-gray-500" />
                           <span className="hidden sm:inline">History:</span> 17 commits
                        </button>
                        
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                           <Plus size={14} className="text-gray-500" />
                           Contribute
                        </button>
                     </div>
                  </div>
                  
                  {/* List Header */}
                  <div className="flex items-center px-4 py-2 bg-gray-50/30 border-b border-gray-100 text-xs font-medium text-gray-500">
                     <div className="w-1/3 md:w-1/4 pl-8">Name</div>
                     <div className="flex-1 hidden md:block">Last commit message</div>
                     <div className="w-24 hidden sm:block text-right pr-4">Size</div>
                     <div className="w-32 text-right">Date</div>
                  </div>

                  {/* Files */}
                  <div className="divide-y divide-gray-50">
                     {MOCK_FILES.map((file, idx) => (
                       <div key={idx} className="group flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm">
                          <div className="w-1/3 md:w-1/4 flex items-center gap-3 pr-4 overflow-hidden">
                             {file.type === 'folder' ? (
                               <Folder size={18} className="text-blue-400 flex-shrink-0 fill-blue-400/20" />
                             ) : (
                               <File size={18} className="text-gray-400 flex-shrink-0" />
                             )}
                             <span className="font-mono text-gray-900 truncate group-hover:text-blue-600 cursor-pointer transition-colors">
                               {file.name}
                             </span>
                             <div className="flex items-center gap-1">
                               {file.tags?.includes('Safe') && (
                                 <span className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-medium text-gray-500">
                                   <Shield size={10} className="text-gray-400" /> Safe
                                 </span>
                               )}
                               {file.tags?.includes('LFS') && (
                                 <span className="hidden lg:flex px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600">
                                   LFS
                                 </span>
                               )}
                             </div>
                          </div>

                          <div className="flex-1 hidden md:flex items-center gap-3 overflow-hidden">
                             <span className="truncate text-gray-500 hover:underline cursor-pointer decoration-gray-300 text-xs">
                               {file.commitMessage}
                             </span>
                             {file.commitHash && (
                                <span className="hidden xl:inline-flex items-center px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded text-[10px] font-mono">
                                  {file.commitHash}
                                  <span className="ml-1 px-1 bg-green-100 text-green-700 rounded-[2px] uppercase text-[8px] font-bold tracking-wide">verified</span>
                                </span>
                             )}
                          </div>

                          <div className="w-24 hidden sm:block text-right pr-4 text-gray-500 text-xs tabular-nums font-mono">
                            {file.size}
                          </div>

                          <div className="w-32 text-right text-gray-500 text-xs flex items-center justify-end gap-3">
                             <span>{file.date}</span>
                             <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100">
                               <Download size={14} />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
           </div>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-blue-100">
      {renderHeader()}
      
      {viewState === ViewState.LIST && renderListView()}
      {viewState === ViewState.DETAIL && renderDetailView()}

      <CreateDatasetModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(data) => {
          handleCreateDataset(data);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
