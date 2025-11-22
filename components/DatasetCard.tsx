import React from 'react';
import { Download, Heart, Database } from 'lucide-react';
import { Dataset } from '../types';

interface DatasetCardProps {
  dataset: Dataset;
  onClick: (dataset: Dataset) => void;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset, onClick }) => {
  return (
    <div 
      onClick={() => onClick(dataset)}
      className="group bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center border border-blue-200/50">
              <Database size={16} />
           </div>
           <div>
             <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
               {dataset.name}
             </h3>
             <p className="text-xs text-gray-500">{dataset.owner}</p>
           </div>
        </div>
        <span className="text-[10px] font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
          {dataset.task.split(' ')[0]}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
        {dataset.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-4 text-xs text-gray-500">
           <span className="flex items-center gap-1">
             <Download size={12} />
             {dataset.downloads.toLocaleString()}
           </span>
           <span className="flex items-center gap-1">
             <Heart size={12} />
             {dataset.likes.toLocaleString()}
           </span>
        </div>
        <span className="text-xs text-gray-400">{dataset.updatedAt}</span>
      </div>
    </div>
  );
};