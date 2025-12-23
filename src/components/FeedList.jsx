import React, { useState } from 'react';
import FeedItem from './FeedItem';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const FeedList = ({ feedData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const items = feedData?.rss?.channel?.item || [];

  // Handle both single item and array of items from XML parser
  const itemList = Array.isArray(items) ? items : [items];

  // Filter items based on search term
  const filteredItems = itemList.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = item.title?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    return title.includes(term) || desc.includes(term);
  });

  if (itemList.length === 0 || !itemList[0]) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border mt-8">
        <p className="text-secondary font-medium">No items found in this feed.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">
            {feedData?.rss?.channel?.title || 'Latest Filings'}
          </h2>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {filteredItems.length} / {itemList.length}
          </span>
        </div>

        <div className="relative w-full md:w-auto min-w-[320px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-secondary">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search in feed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-secondary/50 shadow-sm"
            />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <FeedItem 
              key={`${index}-${item.title?.substring(0, 10)}`}
              title={item.title}
              link={item.link}
              description={item.description}
              pubDate={item.pubDate}
            />
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="col-span-1 md:col-span-2 text-center py-12 border border-dashed border-border rounded-xl bg-card/50"
            >
                <Search size={32} className="mx-auto text-secondary/30 mb-2" />
                <p className="text-secondary font-medium">No items match your search.</p>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default FeedList;
