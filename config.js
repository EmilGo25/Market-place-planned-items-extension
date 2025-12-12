// Configuration for whitelisted sites
// The extension will only be active on these domains

const WHITE_SITES = [
  'amazon.com',
  'www.amazon.com',
  'amazon.co.uk',
  'www.amazon.co.uk',
  'amazon.ca',
  'www.amazon.ca',
  'amazon.de',
  'www.amazon.de',
  'ebay.com',
  'www.ebay.com',
  'walmart.com',
  'www.walmart.com',
  'target.com',
  'www.target.com',
  'bestbuy.com',
  'www.bestbuy.com'
];

// Check if current site is whitelisted
function isWhitelisted(hostname) {
  // Get the current hostname
  const currentHost = hostname || window.location.hostname;
  
  // Check if any whitelisted domain matches
  return WHITE_SITES.some(whiteSite => {
    // Exact match
    if (currentHost === whiteSite) {
      return true;
    }
    // Check if current host ends with the whitelisted domain (for subdomains)
    if (currentHost.endsWith('.' + whiteSite)) {
      return true;
    }
    // Check if whitelisted site is www version and current is not
    if (whiteSite.startsWith('www.') && currentHost === whiteSite.substring(4)) {
      return true;
    }
    return false;
  });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WHITE_SITES, isWhitelisted };
}

