import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Newspaper, Search } from 'lucide-react';
import { fetchXMLData } from './services/rssService';
import DataViewer from './components/DataViewer';
import FeedList from './components/FeedList';
import DisclosureCard from './components/DisclosureCard';
import { getDisclosureFromXmlUrl } from './services/disclosureService';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const SOURCE_URL = 'https://nsearchives.nseindia.com/content/RSS/Online_announcements.xml';
  const SOURCE_FORMAT = 'rss_channel_items';
  const searchParams = new URLSearchParams(window.location.search);
  const xmlUrlFromQuery = searchParams.get('xmlUrl');
  const isStructuredViewerMode = Boolean(xmlUrlFromQuery);

  const [xmlData, setXmlData] = useState(null);
  const [disclosureData, setDisclosureData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchXML = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    try {
      if (isStructuredViewerMode) {
        const disclosure = await getDisclosureFromXmlUrl(url);
        setDisclosureData(disclosure);
        setXmlData(null);
      } else {
        const data = await fetchXMLData(url);
        setXmlData(data);
        setDisclosureData(null);
      }
    } catch (err) {
      setError(err.message);
      setXmlData(null);
      setDisclosureData(null);
    } finally {
      setLoading(false);
    }
  }, [isStructuredViewerMode]);

  useEffect(() => {
    handleFetchXML(xmlUrlFromQuery || SOURCE_URL);
  }, [handleFetchXML, xmlUrlFromQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-card/50 backdrop-blur-md sticky top-0 z-10 border-b border-border py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <Newspaper className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">NSE <span className="text-primary">Pulse</span></h1>
          </div>
          <div className="w-full" style={{ maxWidth: '420px', marginLeft: '1rem' }}>
            {!isStructuredViewerMode && (
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-secondary">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Search in feed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg placeholder:text-secondary/50 shadow-sm"
                  style={{ height: '56px' }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-2">
        <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div></div>
        </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3"
            >
              <div className="bg-red-500 text-white p-1 rounded-full">
                <Loader2 className="rotate-45" size={14} />
              </div>
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}

          {(xmlData || disclosureData) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass-card p-4" style={{ margin: '0 1.5rem' }}>
                {isStructuredViewerMode ? (
                  <DisclosureCard item={disclosureData?.disclosure} />
                ) : SOURCE_FORMAT === 'rss_channel_items' ? (
                  <FeedList feedData={xmlData} searchTerm={debouncedSearchTerm} />
                ) : (
                  <DataViewer data={xmlData} />
                )}
              </div>
            </motion.div>
          )}

          {!xmlData && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 opacity-40 grayscale"
            >
              <Newspaper size={64} />
              <p className="mt-4 font-medium italic">Loading feed data...</p>
            </motion.div>
          )}

          {loading && !xmlData && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
