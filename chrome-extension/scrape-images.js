(function() {

const scrapeInstagram = () => {
  // Find all posts with truncated comments and force load them

  // Each post is an article tag, get all of them
  let posts = [];
  document.querySelectorAll("article").forEach(post => {
    // Buttons titled "load more comments"
    let loadMoreComments = post.querySelector("div>ul>li>button")

    // Links titled "...more"
    let expandSingleComments = post.querySelectorAll("div>ul>li>span>a[href='#']")

    if (loadMoreComments) {
      loadMoreComments.click();
    }

    if (expandSingleComments) {
      expandSingleComments.forEach(expand => expand.click())
    }

    // Instagram posts
    let image = post.querySelector("img[id^=pImage]")

    // Comments might contain hastags which are links themselves to that topic
    // Formatted as an array of strings without any user information
    let comments = Array.from(post.querySelectorAll("div>ul>li>span")).map(el => el.innerText)

    // Only send results for posts with a valid image src and some comments
    if (image && comments.length) {
      posts.push({
        image: image.src,
        comments,
      })
    }
  });

  return posts;
}

const scrapeFacebook = () => {
  let data;
  let posts;

  data = [];
  posts = document.querySelectorAll('div[class^=fbUserContent]');

  // Iterate through the NodeList elements and continue to query
  for (let post of posts) {
    let image = post.querySelector("a .scaledImageFitWidth.img");
    let comments = Array.from(post.querySelectorAll(".UFICommentBody")).map(el => el.innerText);

    // We successfully parsed an image link and there are comments present for the post
    if (image && comments.length) {
      data.push({
        image: image.src,
        comments,
      });
    }
  }

  return data;
}

// Find out what page we're on and call the correct scraping function
const domain = window.location.href;

if (domain.includes('instagram')) {
  return {
    domain: 'instagram',
    data: scrapeInstagram(),
  }
}

if (domain.includes('facebook')) {
  return {
    domain: 'facebook',
    data: scrapeFacebook()
  }
}

})()
