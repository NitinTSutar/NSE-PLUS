import React, { useEffect, useState } from 'react';
import FeedItem from './FeedItem';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const FeedList = ({ feedData }) => {
  const FILTER_OPTIONS = [
    'Monthly business',
    'Order Deal',
    'Acquisition',
    'Takeover',
    'Fund raising',
    'Quarter end',
    'Financial results',
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const items = feedData?.rss?.channel?.item || [];

  // Handle both single item and array of items from XML parser
  const itemList = Array.isArray(items) ? items : [items];

  // Filter items based on search term
  const filteredItems = itemList.filter(item => {
    const title = item.title?.toLowerCase() || '';
    const desc = item.description?.toLowerCase() || '';
    const searchMatches = !searchTerm || title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const filterMatches = !selectedFilter || title.includes(selectedFilter.toLowerCase()) || desc.includes(selectedFilter.toLowerCase());
    return searchMatches && filterMatches;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const pagedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter((prev) => (prev === filter ? '' : filter));
    setCurrentPage(1);
  };

  const highlightTerms = [searchTerm, selectedFilter].filter(Boolean);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

        <div className="w-full md:w-auto min-w-[320px] flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={goToPrevPage}
              disabled={safeCurrentPage === 1}
              className="px-3 py-2 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-primary/10 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-secondary font-medium">
              {safeCurrentPage}/{totalPages}
            </span>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={safeCurrentPage === totalPages}
              className="px-3 py-2 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-primary/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-secondary">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search in feed..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-secondary/50 shadow-sm"
              />
          </div>

          <div className="w-full overflow-x-auto">
            <div className="flex items-center gap-2 py-1 min-w-max">
              {FILTER_OPTIONS.map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => handleFilterClick(filter)}
                    className={`px-3 py-2 rounded-full border text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-card text-secondary border-border hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' }}>
        <AnimatePresence mode="popLayout">
          {pagedItems.map((item, index) => (
            <FeedItem 
              key={`${index}-${item.title?.substring(0, 10)}`}
              title={item.title}
              link={item.link}
              description={item.description}
              pubDate={item.pubDate}
              highlightTerms={highlightTerms}
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

      {filteredItems.length > 0 && (
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={safeCurrentPage === 1}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-primary/10 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-secondary font-medium">
            {safeCurrentPage}/{totalPages}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={safeCurrentPage === totalPages}
            className="px-3 py-2 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-primary/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedList;
