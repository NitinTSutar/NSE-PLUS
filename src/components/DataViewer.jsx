import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, FileJson } from 'lucide-react';

const DataNode = ({ label, value, level = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const PAGE_SIZE = 50;
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  
  const isObject = typeof value === 'object' && value !== null;
  const isArray = Array.isArray(value);
  
  if (!isObject) {
    return (
      <div 
        className="flex items-start gap-2 py-1 hover:bg-white/5 rounded px-2 transition-colors"
        style={{ marginLeft: level * 16 }}
      >
        <span className="text-secondary font-mono text-sm shrink-0 min-w-[120px]">{label}:</span>
        <span className="text-foreground font-medium text-sm break-all">{String(value)}</span>
      </div>
    );
  }

  const entries = Object.entries(value);
  const hasMore = entries.length > visibleCount;

  const handleShowMore = (e) => {
      e.stopPropagation();
      setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const handleShowAll = (e) => {
      e.stopPropagation();
      setVisibleCount(entries.length);
  }

  return (
    <div className="flex flex-col">
      <div 
        role="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1.5 hover:bg-white/5 rounded px-2 cursor-pointer transition-colors group select-none"
        style={{ marginLeft: level * 16 }}
      >
        <span className="text-secondary/70 group-hover:text-primary transition-colors">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        <span className="text-primary font-mono text-sm font-semibold">
           {label} 
           <span className="text-secondary/60 text-xs ml-2 font-normal">
              {isArray ? `[${value.length}]` : `{${entries.length}}`}
           </span>
        </span>
      </div>
      
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        {entries.slice(0, visibleCount).map(([key, val], idx) => (
          <DataNode 
            key={`${key}-${idx}`} 
            label={key} 
            value={val} 
            level={level + 1} 
          />
        ))}
        
        {hasMore && (
            <div 
              style={{ marginLeft: (level + 1) * 16 }}
              className="py-1 px-2 flex gap-3"
            >
                <button 
                  onClick={handleShowMore}
                  className="text-xs text-primary hover:underline font-medium"
                >
                    Show {PAGE_SIZE} more...
                </button>
                <button 
                  onClick={handleShowAll}
                  className="text-xs text-secondary hover:text-foreground hover:underline"
                >
                    Show all ({entries.length - visibleCount} more)
                </button>
            </div>
        )}
      </motion.div>
    </div>
  );
};

const DataViewer = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-card w-full rounded-xl border border-border p-4 mt-4 shadow-inner bg-black/20">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
        <FileJson size={16} className="text-primary" />
        <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">Data View</h4>
      </div>
      <div className="font-sans">
        {Object.entries(data).map(([key, value], idx) => (
          <DataNode key={idx} label={key} value={value} />
        ))}
      </div>
    </div>
  );
};

export default DataViewer;
