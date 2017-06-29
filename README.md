## Instafeels - Explained with comments for Ashlee

So the hackathon was a bit crazy right? Especially the second day where I was furiously typing to save the project from disarray.
I thought I would take the time to write out and explain what happened on that second day so you could understand the final project and
complete some of the practice we learned together.

### Overview

While the final project wasn't exactly everything we wanted it to be, and had to change the end specification, there are still a lot
of things to take away from how the final solution works.

The biggest thing there is to learn here, is how **clients and servers interact**. This is huge because it's how we get _dynamic_ data
on the web.

Ever been to a really old website that was only text/HTML and had no dynamic content (feed, search bar, notifications, etc)?
That's what the Internet would be like if we couldn't have clients (web browsers that render HTML/CSS/JavaScript) talk to server (written in any language).

The Chrome Extension we worked on now does the following things:

1. (Ashlee) Finds all of the images on a page by **searching the HTML using JavaScript** (`document.querySelectorAll("img[class^='pImage']")`)
2. (Jacob) Send the links to the images to our server to be processed
3. (Jacob) Gets a 'response' back from the server with the news images and replaces the old images

### How the Chrome Extension and Server work with each other

This is how the extension and the server interact - meaning the commands they execute, and most importantly in what **order**.

0. **[Extension]** Defines a view to show when the user clicks on the extension button (`main.html`). The view also loads the main script which we use to inject our code into the page (instagram.com)
1. **[Extension]** Listens for when the "scrape" button in our view is clicked and tells chrome to run the script on the active page we're on
2. **[Extension]** Our `scrape-images.js` script will get us almost all of the images on the page and return them
3. **[Extension]** Sends the images from the scraping to the server by calling `sendPostsToServer`. This makes an HTTP Request to the server that's running on the current compute (that's what `localhost` means). It sends the image url, and some data if the comments are happy or sad.
4. **[Server]** Our server gets the images & the happy/sad values and makes a request to `cloudinary` which is a website that gives us an API to modify the image based on the mood of the comments. It's important to note that Cloudinary API is running on **their own servers**. So servers are computed that exist on the Internet and can talk to each other using HTTP (through the web).
5. **[Server]** Our server gets a response back from Cloudinary with the new image url. It 'responds' to our Chrome Extension with the following data ` { old: "<the original image url>", new: "<the new image url" }`.
6. **[Extension]** The extension gets the response back from our server with the old and new images and calls `replace-images.js` which goes back into instagram.com and replaces the original images!

### Things to think about

There's so much information here, the explanations could keep going. But there are a few things I hope you can take away from this project and the code.

The first is an understanding that you can inspect and see how the web works **any time you want**! All you need to do is right-click > "inspect element" on any website just to see how it works!

The second is how most of everything around you **is an API** :P
As annoying as that word must sound by now, just take a minute to think about it.

For every app, website, and machine you interact with, there is a hidden bundle of code called an API that can be used to do anything the app/website/machine can do!
Your phone has an API to play sound, take a picture, send a text, etc. Developers can use those APIs to build better and more useful apps for everyone to use.
They can get two apps that usually never communicate to communicate, like Twitter and your car!

So just know that all of these things are accessible with just a little bit of searching and messing around with code.


### Next Steps

Look through the `chrome-extension` directory again, start with `main.js`. I've added comments to all of the files so you can understand what is happening and **why**.

If you have any questions, click on the line number on Github.com and send me the link, I'd be happy to answer anything that comes to mind at all!

