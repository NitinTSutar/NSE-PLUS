import React from 'react';
import { ExternalLink, Calendar, User, FileText, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightText = ({ text, terms, className }) => {
  const sourceText = text || '';
  const cleanTerms = (terms || []).map((term) => term?.trim()).filter(Boolean);

  if (!sourceText || cleanTerms.length === 0) {
    return <span className={className}>{sourceText}</span>;
  }

  const uniqueTerms = [...new Set(cleanTerms.map((term) => term.toLowerCase()))];
  const pattern = uniqueTerms.map(escapeRegExp).join('|');
  const regex = new RegExp(`(${pattern})`, 'ig');
  const parts = sourceText.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = uniqueTerms.includes(part.toLowerCase());
        if (isMatch) {
          return (
            <mark key={`${part}-${index}`} className="bg-primary/10 text-primary rounded px-1">
              {part}
            </mark>
          );
        }
        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
      })}
    </span>
  );
};

const FeedItem = ({ title, link, description, pubDate, highlightTerms = [] }) => {
  // Extract acquirer name from description if it matches the pattern
  const acquirerMatch = description?.match(/NAME\(S\)OF THE ACQUIRER AND ITS\(PAC\) : (.*)/);
  const acquirerName = acquirerMatch ? acquirerMatch[1] : description;

  const isPDF = link?.toLowerCase().endsWith('.pdf');
  const isXML = link?.toLowerCase().endsWith('.xml');

  const openStructuredViewer = () => {
    const target = `${window.location.origin}${window.location.pathname}?xmlUrl=${encodeURIComponent(link)}`;
    window.open(target, '_blank', 'noopener,noreferrer');
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
          <HighlightText text={title} terms={highlightTerms} />
        </h3>
        <div className="flex gap-2 shrink-0">
           {isXML && (
             <button 
               onClick={openStructuredViewer}
               className="p-2 rounded-full transition-all hover:bg-primary/10 text-secondary hover:text-primary"
               title="View Structured Data"
             >
               <FileCode size={20} />
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
            <HighlightText text={acquirerName} terms={highlightTerms} className="font-medium" />
          </div>
        )}
      </div>

      {description && !acquirerMatch && (
        <p className="text-secondary leading-relaxed line-clamp-2">
          <HighlightText text={description} terms={highlightTerms} />
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
               onClick={openStructuredViewer}
               className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
             >
               View Structured Data
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

    </motion.div>
  );
};

export default FeedItem;

