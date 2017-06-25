const chromeExecuteScraping = () => {
  // We don't specify a tabId because we want to operate on the current tab
  const tabId = null;
  const options = {
    file: 'scrape-images.js'
  };
  const handleResults = (results) => {
    console.log(results);
  };

  // Inject the script and have chrome return the scraped results
  chrome.tabs.executeScript(tabId, options, handleResults);
};

document.addEventListener('DOMContentLoaded', () => {
  // Get the button in the chrome popup and bind a click handler to it
  const scrapeButton = document.getElementById('scrape-all-button')
  scrapeButton.addEventListener('click', event => {
    // Tell chrome to inject our scraping script into the page
    chromeExecuteScraping();
  });
});

