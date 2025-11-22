export enum TaskType {
  NLP = 'Natural Language Processing',
  CV = 'Computer Vision',
  AUDIO = 'Audio',
  TABULAR = 'Tabular',
  RL = 'Reinforcement Learning'
}

export interface Dataset {
  id: string;
  owner: string;
  name: string;
  description: string;
  task: TaskType;
  downloads: number;
  likes: number;
  updatedAt: string;
  tags: string[];
  size: string;
  license: string;
  isPrivate?: boolean;
}

export interface DatasetFile {
  name: string;
  size: string;
  type: 'json' | 'csv' | 'parquet' | 'image' | 'folder' | 'file';
  date: string;
  commitMessage?: string;
  commitHash?: string;
  tags?: string[];
}

export enum ViewState {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  CREATE = 'CREATE'
}