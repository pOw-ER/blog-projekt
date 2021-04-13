const express = require('express')
const { body, validationResult } = require('express-validator');
const date = require('date-and-time');
const app = express()
const fs = require('fs');
const { stringify } = require('querystring');
require('dotenv').config()
const PORT = process.env.PORT || 3000
const articles = require('./data/articles.json')
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
})

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())



app.get('/', (req, res) => {
  res.render('pages/index', { articles })
})

app.get('/article/:id', (req, res) => {
  res.render('pages/article', { article: articles[req.params.id] })
})

app.get('/new-article', (req, res) => {
  res.render('pages/new-article', { articles })
})

app.post('/new',
  body('articleTitle').isLength({ min: 3 }).trim(),
  body('articlePicture').isLength({ min: 3 }).trim(),
  body('authorName').isLength({ min: 3 }).trim(),
  body('authorPicture').isLength({ min: 3 }).trim(),
  body('authorArticle').isLength({ min: 3 }).trim(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const now = new Date();
    // console.log(date.format(now, 'MMM DD, YYYY'))
    // console.log(parseInt(req.body.authorArticle.length / 10, 10));
    const new_blog = {
      id: articles[articles.length - 1].id + 1,
      title: req.body.articleTitle,
      url: req.body.articlePicture,
      author: req.body.authorName,
      author_bild: req.body.authorPicture,
      body: req.body.authorArticle,
      published_at: date.format(now, 'MMM DD, YYYY'),
      duration: parseInt(req.body.authorArticle.length / 10, 10),
    }

    articles.push(new_blog)
    fs.writeFile('./data/articles.json', JSON.stringify(articles), 'utf8', (err) => {
      if (err) throw err;
      console.log('works');
    })
    // console.log(articles);
    // console.log(new_blog);
    res.redirect('/')
  })

