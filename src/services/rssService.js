import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

const resolveNseProxyUrl = (url) => {
  if (url.includes('nseindia.com') || url.includes('nsearchives.nseindia.com')) {
    if (url.includes('nsearchives.nseindia.com')) {
      return url.replace('https://nsearchives.nseindia.com', '/nse-archives');
    }
    return url.replace('https://www.nseindia.com', '/nse-main');
  }
  return url;
};

export const fetchXMLText = async (url) => {
  try {
    const fetchUrl = resolveNseProxyUrl(url);
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const proxyResponse = await fetch(proxyUrl);
      const proxyData = await proxyResponse.json();
      return proxyData.contents;
    }

    return await response.text();
  } catch (error) {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const proxyResponse = await fetch(proxyUrl);
      const proxyData = await proxyResponse.json();
      return proxyData.contents;
    } catch (proxyError) {
      throw new Error('Failed to fetch data. ' + error.message);
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
      const xmlText = await fetchXMLText(url);
      return parser.parse(xmlText);
    } catch (error) {
      console.error('Fetch XML Data error:', error);
      throw new Error('Failed to fetch data. ' + error.message);
    }
  };
