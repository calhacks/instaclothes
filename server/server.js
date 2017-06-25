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
        }
        else {
          resolve(sentiment)
        }
      })
    })
  })

  return Promise.all(allPromises).then(allSentiments => {
    return allSentiments
  })
}


var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'university-of-california-berkeley', 
  api_key: '176617747466324', 
  api_secret: 's9NzxWN0_VSb9eWWE6qjThQBYIA' 
});


app.get('/i', (req, res)  => {
  var url = req.query.url
    console.log(url)
    cloudinary.uploader.upload(url, function(result) { 
        //res.cloudinary.com/university-of-california-berkeley/image/upload/v1498409624/lbqjucnb0wenmbd8skiw.jpg
        return_url = result['url'].replace('upload/', 'upload/e_oil_paint:100/')
        res.json({'url': return_url})
    });

})

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
