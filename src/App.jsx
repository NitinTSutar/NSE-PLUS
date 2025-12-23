import React, { useState, useEffect } from 'react';
import { Search, Loader2, Newspaper, ArrowRight, Github } from 'lucide-react';
import { fetchRSSFeed } from './services/rssService';
import FeedList from './components/FeedList';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [url, setUrl] = useState('');
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    if (e) e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRSSFeed(url);
      setFeedData(data);
    } catch (err) {
      setError(err.message);
      setFeedData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md sticky top-0 z-10 border-b border-border py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <Newspaper className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">NSE <span className="text-primary">Pulse</span></h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-secondary hover:text-foreground transition-colors p-2">
                <Github size={20} />
             </button>
             <div className="h-4 w-px bg-border"></div>
             <span className="text-xs font-medium text-secondary">v1.0.0</span>
          </div>
        </div>
      </header>

      <main className="container pt-12">
        {/* Intro Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-secondary">
              Analyze NSE RSS Feeds
            </h2>
            <p className="text-lg text-secondary mb-8">
              Beautifully view and explore structured data from National Stock Exchange's corporate filings.
            </p>
          </motion.div>

          {/* Search Form */}
          <form onSubmit={handleFetch} className="relative group max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-secondary group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste RSS feed URL here..."
              className="w-full pl-12 pr-32 py-4 bg-card border-2 border-border rounded-2xl shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-foreground font-medium"
            />
            <div className="absolute right-2 inset-y-2">
               <button
                type="submit"
                disabled={loading}
                className="h-full px-6 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Fetch Feed'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
          

        </div>

        {/* Content Area */}
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

          {feedData && <FeedList feedData={feedData} />}

          {!feedData && !loading && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 opacity-40 grayscale"
            >
               <Newspaper size={64} />
               <p className="mt-4 font-medium italic">Waiting for feed data...</p>
            </motion.div>
          )}

          {loading && !feedData && (
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
