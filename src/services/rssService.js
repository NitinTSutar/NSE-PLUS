import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

/**
 * Fetches and parses an RSS feed from a given URL.
 * @param {string} url - The URL of the RSS feed.
 * @returns {Promise<Object>} - The parsed RSS feed data.
 */
export const fetchRSSFeed = async (url) => {
  try {
    let fetchUrl = url;

    // Use local proxy if it's an NSE domain to bypass CORS
    if (url.includes('nseindia.com') || url.includes('nsearchives.nseindia.com')) {
      if (url.includes('nsearchives.nseindia.com')) {
        fetchUrl = url.replace('https://nsearchives.nseindia.com', '/nse-archives');
      } else {
        fetchUrl = url.replace('https://www.nseindia.com', '/nse-main');
      }
    }

    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
        // Fallback to public proxy if local fetch fails (e.g., in production)
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        const proxyData = await proxyResponse.json();
        return parser.parse(proxyData.contents);
    }

    const xmlData = await response.text();
    return parser.parse(xmlData);
  } catch (error) {
    console.error('Fetch error:', error);
    try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        const proxyData = await proxyResponse.json();
        return parser.parse(proxyData.contents);
    } catch (proxyError) {
        throw new Error('Failed to fetch RSS feed. This might be due to NSE security restrictions or CORS.');
    }
  }
};

/**
 * Fetches and parses a specific XML data file from a given URL.
 * @param {string} url - The URL of the XML file.
 * @returns {Promise<Object>} - The parsed XML data.
 */
export const fetchXMLData = async (url) => {
    try {
      let fetchUrl = url;
  
      // Use local proxy logic
      if (url.includes('nseindia.com') || url.includes('nsearchives.nseindia.com')) {
        if (url.includes('nsearchives.nseindia.com')) {
          fetchUrl = url.replace('https://nsearchives.nseindia.com', '/nse-archives');
        } else {
          fetchUrl = url.replace('https://www.nseindia.com', '/nse-main');
        }
      }
  
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
          // Fallback to public proxy
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const proxyResponse = await fetch(proxyUrl);
          const proxyData = await proxyResponse.json();
          return parser.parse(proxyData.contents);
      }
  
      const xmlData = await response.text();
      return parser.parse(xmlData);
    } catch (error) {
      console.error('Fetch XML Data error:', error);
      // Try one last time with proxy if direct fetch fail was caught
      try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
          const proxyResponse = await fetch(proxyUrl);
          const proxyData = await proxyResponse.json();
          return parser.parse(proxyData.contents);
      } catch (proxyError) {
          throw new Error('Failed to fetch data. ' + error.message);
      }
    }
  };
