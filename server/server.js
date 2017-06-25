const ToneAnalyzer = require('watson-developer-cloud/tone-analyzer/v3')

const toneUsername = process.env.TONE_USERNAME
const tonePassword = process.env.TONE_PASSWORD

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

const handleImageUpload = (posts) => {
  const acc = {}
  const allPromises = posts.map((post) => {
    const comments = post.comments.join('. ')
    const params = {
      text: comments,
      tone: 'emotion',
    }

    return new Promise((resolve, reject) => {
      toneAnalyzer.tone(params, (err, sentiment) => {
        if (err) {
          console.log(err, 'Error')
        }
        else {
          resolve(sentiment)
        }
      })
    })
  })

  return Promise.all(allPromises).then(allSentiments => {
    console.log(JSON.stringify(allSentiments))
    return allSentiments
  })
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
