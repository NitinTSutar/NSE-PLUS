import React, { useState } from 'react';
import { ExternalLink, Calendar, User, FileText, ChevronDown, ChevronUp, Loader2, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchXMLData } from '../services/rssService';
import DataViewer from './DataViewer';

const FeedItem = ({ title, link, description, pubDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract acquirer name from description if it matches the pattern
  const acquirerMatch = description?.match(/NAME\(S\)OF THE ACQUIRER AND ITS\(PAC\) : (.*)/);
  const acquirerName = acquirerMatch ? acquirerMatch[1] : description;

  const isPDF = link?.toLowerCase().endsWith('.pdf');
  const isXML = link?.toLowerCase().endsWith('.xml');

  const handleViewData = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);

    if (!details && !loading) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchXMLData(link);
        setDetails(data);
      } catch (err) {
        setError("Failed to load data structure. " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card p-6 mb-4 flex flex-col gap-3 transition-all duration-300 hover:shadow-xl group"
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex gap-2 shrink-0">
           {isXML && (
             <button 
               onClick={handleViewData}
               className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-primary/10 text-secondary hover:text-primary'}`}
               title="View Structured Data"
             >
               {isExpanded ? <ChevronUp size={20} /> : <FileCode size={20} />}
             </button>
           )}
           <a 
             href={link} 
             target="_blank" 
             rel="noopener noreferrer"
             className="p-2 rounded-full hover:bg-primary/10 text-secondary hover:text-primary transition-all"
             title={isPDF ? "View PDF" : "View Source File"}
           >
             <ExternalLink size={20} />
           </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-secondary">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-primary/70" />
          <span>{pubDate}</span>
        </div>
        {acquirerName && (
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-primary/70" />
            <span className="font-medium">{acquirerName}</span>
          </div>
        )}
      </div>

      {description && !acquirerMatch && (
        <p className="text-secondary leading-relaxed line-clamp-2">
          {description}
        </p>
      )}

      {/* Footer / Actions */}
      <div className="mt-2 pt-4 border-t border-border/50 flex items-center justify-between">
         <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary/60 flex items-center gap-1">
            {isPDF ? <FileText size={12} /> : <FileCode size={12} />}
            {isPDF ? 'PDF Document' : 'XML Data'}
         </span>
         
         {isXML ? (
             <button 
               onClick={handleViewData}
               className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
             >
               {isExpanded ? 'Hide Data' : 'View Data'}
             </button>
         ) : (
             <a 
               href={link} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
             >
               Open Document <ExternalLink size={10} />
             </a>
         )}
      </div>

      {/* Expanded Data View */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : error ? (
              <div className="p-4 mt-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                {error}
              </div>
            ) : (
              <DataViewer data={details} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default FeedItem;

