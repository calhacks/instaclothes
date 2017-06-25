const replaceImage = (data) => {
  chrome.tabs.executeScript({
    code: 'var data = ' + JSON.stringify(data),
  }, function() {
    chrome.tabs.executeScript({
      file: 'replace-image.js'
    })
  })


}

const sendPostsToServer = (domain, values) => {
  console.log('data', values);
  values.forEach(v => {
    const url = v.image;
    const happy = Math.floor(Math.random() * 100)
    const sad = Math.floor(Math.random() * 100)
    console.log('v', v)
    console.log('happy', happy)
    console.log('sad', sad)
    $.ajax(`http://localhost:3000/i?url=${url}&happy=${happy}&sad=${sad}`, {
      method: 'GET',
    })
    .done(oldAndNew=> {
      console.log('result', oldAndNew)
      replaceImage(oldAndNew)
    })
    .fail(error => {
      console.error(error)
    })
  })
  // const reqPromise = $.ajax(`http://localhost:3000/i?url=${url}&happy=0.99&sad=0.5`, {
  //   method: 'GET',
  // })
  // reqPromise
  //   .done(oldAndNew=> {
  //     console.log('result', oldAndNew)
  //     replaceImage(oldAndNew)
  //   })
  //   .fail(error => {
  //     console.error(error)
  //   })
}

const chromeExecuteScraping = () => {
  // We don't specify a tabId because we want to operate on the current tab
  const tabId = null;
  const options = {
    file: 'scrape-images.js'
  };
  const handleResults = (results) => {
    const result = results[0]
    console.log('RESULT', result)
    sendPostsToServer(result.domain, result.data)
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

