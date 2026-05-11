import React, { useState } from 'react';
import FeedItem from './FeedItem';
import { AnimatePresence } from 'framer-motion';
import { Search, Download } from 'lucide-react';

const FeedList = ({ feedData, searchTerm = '' }) => {
  const FILTER_OPTIONS = [
    'Monthly business',
    'Order Deal',
    'Acquisition',
    'Takeover',
    'Fund raising',
    'Quarter end',
    'Financial results',
  ];
  const [selectedFilter, setSelectedFilter] = useState('');
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

  const handleFilterClick = (filter) => {
    setSelectedFilter((prev) => (prev === filter ? '' : filter));
  };

  const highlightTerms = [searchTerm, selectedFilter].filter(Boolean);

  const getTimestamp = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
  };

  const sanitizeFilenamePart = (value) =>
    String(value || '')
      .trim()
      .split('')
      .filter((ch) => ch.charCodeAt(0) >= 32 && !/[<>:"/\\|?*]/.test(ch))
      .join('')
      .replace(/\s+/g, '-');

  const csvEscape = (value) => {
    const text = String(value ?? '');
    const escaped = text.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const handleDownload = () => {
    const rows = filteredItems.map((item) => ({
      Title: item.title || '',
      Link: item.link || '',
      Description: item.description || '',
      PubDate: item.pubDate || '',
    }));

    const headers = ['Title', 'Link', 'Description', 'PubDate'];
    const csvLines = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
    ];
    const csvContent = csvLines.join('\n');

    const titleBase = feedData?.rss?.channel?.title || 'Latest Announcements';
    const hasSearchOrFilter = Boolean(searchTerm.trim() || selectedFilter.trim());
    const searchPart = sanitizeFilenamePart(searchTerm.trim() || 'NoSearch');
    const filterPart = sanitizeFilenamePart(selectedFilter.trim() || 'NoFilter');
    const timestamp = getTimestamp();
    const fileName = hasSearchOrFilter
      ? `${titleBase}-(${searchPart}&${filterPart})-(${timestamp}).csv`
      : `${titleBase} (${timestamp}).csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (itemList.length === 0 || !itemList[0]) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border mt-8">
        <p className="text-secondary font-medium">No items found in this feed.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">
            {feedData?.rss?.channel?.title || 'Latest Filings'}
          </h2>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
            title="Download CSV"
          >
            <Download size={16} />
            Download
          </button>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {filteredItems.length} / {itemList.length}
          </span>
        </div>

        <div className="w-full md:w-auto min-w-[320px] flex flex-col gap-3">
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
          {filteredItems.map((item, index) => (
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
            <div className="col-span-1 md:col-span-2 text-center py-12 border border-dashed border-border rounded-xl bg-card/50">
                <Search size={32} className="mx-auto text-secondary/30 mb-2" />
                <p className="text-secondary font-medium">No items match your search.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FeedList;
