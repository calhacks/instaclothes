const url = require('url')

const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'university-of-california-berkeley',
  api_key: '176617747466324',
  api_secret: 's9NzxWN0_VSb9eWWE6qjThQBYIA'
});

const ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3')

const toneUsername ="618eb3bf-d72c-408a-b43a-92d071fb6742"
const tonePassword = "QwwXWENcAwje"

const toneAnalyzer = new ToneAnalyzer({
  username: toneUsername,
  password: tonePassword,
  version_date: '2017-05-19',
})

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const makepretty = (allTheThings) => {
  const allPromises = allTheThings.map(data => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(url, function(result) {
        happy = Math.floor(Number(happy) * 100)
        sad = Math.floor(Number(sad) * 100)
        return_url = result.url.replace('upload/', `upload/e_cartoonify/e_red:${sad}/e_blue:${happy}/`)
        resolve({
          old: url,
          new: return_url,
        })
      });
    })
  })

  const finalOutputToClient = Promise.all(allPromises).then(data => data)
}


const convertImages = (allSentiments) => {
  const finalData = allSentiments.map(sentiment => {
    const url = sentiment.url
    const sadness = sentiment[0].document_tone.tone_categories[0].tones[0].sadness
    const happiness = sentiment[0].document_tone.tone_categories[0].tones[0].happiness
    const final =  {
      url,
      sadness,
      happiness,
    }
    return final
  })

  return makepretty(finalData);
}

const handleImageUpload = (posts) => {
  const acc = {}
  const allPromises = posts.map((post) => {
    const comments = post.comments.join('.').replace('.',  '').replace(' . ', ' ')
    const params = {
      text: comments,
      tone: 'emotion',
    }

    return new Promise((resolve, reject) => {
      toneAnalyzer.tone(params, (err, sentiment) => {
        if (err) {
          console.log(err, 'Error')
          reject()
        }
        else {
          console.log("API COMPLETED", post)
          return resolve({
            url: post.image,
            sentiment,
          })
        }
      })
    })
  })

  /*
   * [{ image: string, sentiment: [ ... ] }]
  */
  console.log(allPromises)
  const allSentiments = Promise.all(allPromises).then(sentiments => sentiments);

  console.log('allSentiments', allSentiments);

  const finalImageAndSentiment = convertImages(allSentiments)

  res.json(finalImageAndSentiment)
}

app.post('/instagram', (req, res) => {
  if (req.body) {
    const posts = req.body.results
    handleImageUpload(posts)
  }
})

app.post('/facebook', (req, res) => {
  if (req.body) {
    const posts = req.body.results
    handleImageUpload(posts)
  }
})

app.listen(3000, () => console.log('Server Started! .... http://localhost:3000/'))
