/*
 *                                  HOW WE GOT HERE
 *
 * So we're going to explain what's happening with this Chrome Extension and how it works
 *
 * A refresheer. To even get a Chrome Extension to work, we need to define a `manifest.json` file.
 * When we load our extension, this tells Chrome **how our extension is going to work, and what permissions it can have**.
 *
 * So we tell chrome that our main file is `main.html`. At the end of `main.html` you'll see this HTML tag:
 *  <script type="text/javascript" src="main.js"></script>
 * A <script> tag tells the web page to load some JavaScript. That JavaScript, as you can tell, is this file!
 *
 * So that means that when someone clicks on the extension the following things are going to happen:
 * 1. Chrome is going to display our view (main.html)
 * 2. It's also going to load our main script file (main.js)
 *
 * ------------------------------------------------------------------------------------------------------
 *
 * Okay now let's explore what this script is doing.
 *
 * You'll see a lot this: `(someVariable) => { code }` this is same as a function! `function (someVariable) { code }`
 *
 * The fuctions are going to be called in order (A -> B -> C -> and so on), so look down at the bottom
 * of the file and you'll see where (A) is.
 *
 * The functions are in reverse order because in JavaScript we need to define variables/functions before we can use it.
 * So the order our code is executed from the bottom of the file to the top.
 *
 * Note: Not all JavaScript is like this. Most is from the top down, but we're doing a lot of "handling" of events
 * and other things.
 * So at the time it made sense to organize the file like this. There are **many** other ways to do it!
 *
 */

// =============================================================================
//                                      (D)
//                  Updating the website with new images
// =============================================================================
//
// The last step is to provide the oldAndNew data to the `replace-images.js` script
// Given the old url, it will find the image on the page, and replace it with the new url
const replaceImage = (data) => {
  // Just like before we tell chrome to execute a script
  //
  // `var data = ...` is a trick to inject our data into the script
  //
  // By default all chrome scripts are isolated from each other and can't access
  // eachother's data.
  chrome.tabs.executeScript({
    code: 'var data = ' + JSON.stringify(data),
  }, function() {
    chrome.tabs.executeScript({
      file: 'replace-image.js'
    })
  })
}

// =============================================================================
//                                      (C)
//                        Making a request to the server
// =============================================================================
//
// Now that the scraper has given us all of the comment and image infromation,
// we can use it to send the image info to our server.
//
// You'll notice that we're using the `$` symbol.
//
// This is a "library" called JQuery. It's not an API because it doesn't allow us
// to do anything we couldn't already do. It's just a collection of functions that are
// easier to use than the regular ones.
//
// In this case, we're using JQuery to make an HTTP request to our server.
// JQuery uses a term called "AJAX", but two two are the same.
//
// With HTTP we want to specify the following into:
// - WHERE are we getting the information from? The URL
// - HOW are we fetching information? Are we adding new information? or are we updating existing information?
// - WHAT are we getting? Do we need to tell the server what we're looking for?
//
const sendPostsToServer = (domain, values) => {
  console.log('data', values);
  // This is just like loop! But we're looping over an array,
  // and we provide a function for each iteration.
  // The function gets a new instance every time
  values.forEach(v => {
    // For the demo we needed to fake these values out
    const url = v.image;
    const happy = Math.floor(Math.random() * 100)
    const sad = Math.floor(Math.random() * 100)
    // WHERE = `localhost:300/i`
    // WHAT = `?url=""&happy=""&sad=""`
    $.ajax(`http://localhost:3000/i?url=${url}&happy=${happy}&sad=${sad}`, {
      // HOW = GET
      method: 'GET',
    })
    .done(oldAndNew=> {
      // {
      //  old: "url...",
      //  new: "url...",
      // }
      //
      // Now that we have the old and new image information, we can call our final function
      // which is going to replace the images and complete the whole processes in (D)
      replaceImage(oldAndNew)
    })
    .fail(error => {
      console.error(error)
    })
  })
}

// =============================================================================
//                                      (B)
//                     Scraping the current page for images
// =============================================================================
//
// This is a function that does one thing: Tell chrome to inject and execute one of
// our files **into** to the current website.
//
// We do this because Chrome Extensions can't automatically read what's on your site.
// So we have to ask Chrome directly to "executeScript"
const chromeExecuteScraping = () => {
  // We don't specify a tabId because we want to operate on the current tab
  const tabId = null;
  const options = {
    file: 'scrape-images.js'
  };
  const handleResults = (results) => {
    const result = results[0]
    console.log('RESULT', result)

    // Now that we have the result we want to go to (C)
    sendPostsToServer(result.domain, result.data)
  };

  // Inject the script and have chrome return the scraped results
  // When the scripe is done executing, chrome will call the function we
  // provide: `handleResult`
  chrome.tabs.executeScript(tabId, options, handleResults);
};

// =============================================================================
//                                      (A)
//                         Setting a button click handler
// =============================================================================
//
// This is the first code that is executed when our extension is clicked
// A reminder: It looks for our "Scrape All" <button> in `main.html` and sets up a "listener"
//
// When that button is clicked, we want to tell chrome to scrape the images from the website
document.addEventListener('DOMContentLoaded', () => {

  const handleScrapeButtonClick = (event) {
    // Tell chrome to inject our scraping script into the page
    chromeExecuteScraping();
  }

  // Find the button in `main.html`
  const scrapeButton = document.getElementById('scrape-all-button')

  // Listen for when the button is clicked. When it's clicked, tell Chrome which function it should call.
  // I.e. The one we provide to it called `handleScrapeButtonClick`.
  //
  // Now that the button has been called we want to go to (B)
  scrapeButton.addEventListener('click', handleScrapeButtonClick);
});

