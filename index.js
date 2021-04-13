const express = require('express')
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const date = require('date-and-time');
const formidable = require('formidable');
const app = express()
const fs = require('fs');
const { stringify } = require('querystring');
require('dotenv').config()
const PORT = process.env.PORT || 3000
let articles = require('./data/articles.json')

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
})

app.use(express.static('public'))
app.use(express.static('imgUpload'))

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
  res.render('pages/index', { articles })
})

app.get('/article/:id', (req, res) => {
  let article = articles.find(elt => elt.id == req.params.id)
  res.render('pages/article', { article, articles })
})

app.get('/new-article', (req, res) => {
  res.render('pages/new-article', { articles })
})

app.post('/delete/:id', (req, res) => {
  let newArticles = articles.filter(elt => String(elt.id) !== String(req.params.id))
  console.log(newArticles);
  articles = newArticles
  fs.writeFile('./data/articles.json', JSON.stringify(articles), 'utf8', (err) => {
    if (err) throw err;
    console.log('works');
  })
  // console.log(articles);
  res.redirect('/')
})

app.post('/new',
  // body('articleTitle').isLength({ min: 3 }).trim(),
  // // body('articlePicture').isLength({ min: 3 }).trim(),
  // body('authorName').isLength({ min: 3 }).trim(),
  // // body('authorPicture').isLength({ min: 3 }).trim(),
  // body('authorArticle').isLength({ min: 3 }).trim(),
  // (req, res) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  // },
  (req, res, next) => {
    const form = formidable({ multiples: true, uploadDir: './imgUpload', keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }
      const now = new Date();

      let new_blog = {
        id: uuidv4(),
        title: fields.articleTitle,
        url: `${files.articlePicture.path.slice(9)}`,
        author: fields.authorName,
        author_bild: `${files.authorPicture.path.slice(9)}`,
        body: fields.authorArticle,
        published_at: date.format(now, 'MMM DD, YYYY'),
        duration: parseInt(fields.authorArticle.length / 20, 10),
      }

      articles.unshift(new_blog)
      fs.writeFile('./data/articles.json', JSON.stringify(articles), 'utf8', (err) => {
        if (err) throw err;
        console.log('works');
      })
      // console.log(articles);
      // console.log(new_blog);
      res.redirect('/')
      console.log(new_blog);
      // res.json({ fields, files });
    });
  });

// app.get('/404', (req, res) => {
//   res.render('pages/404')
// })


// app.post('/new',
//   body('articleTitle').isLength({ min: 3 }).trim(),
//   body('articlePicture').isLength({ min: 3 }).trim(),
//   body('authorName').isLength({ min: 3 }).trim(),
//   body('authorPicture').isLength({ min: 3 }).trim(),
//   body('authorArticle').isLength({ min: 3 }).trim(),
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const now = new Date();
//     // console.log(date.format(now, 'MMM DD, YYYY'))
//     // console.log(parseInt(req.body.authorArticle.length / 10, 10));
//     let new_blog = {
//       id: articles[articles.length - 1].id + 1,
//       title: req.body.articleTitle,
//       url: req.body.articlePicture,
//       author: req.body.authorName,
//       author_bild: req.body.authorPicture,
//       body: req.body.authorArticle,
//       published_at: date.format(now, 'MMM DD, YYYY'),
//       duration: parseInt(req.body.authorArticle.length / 10, 10),
//     }

//     articles.push(new_blog)
//     fs.writeFile('./data/articles.json', JSON.stringify(articles), 'utf8', (err) => {
//       if (err) throw err;
//       console.log('works');
//     })
//     // console.log(articles);
//     // console.log(new_blog);
//     res.redirect('/')
//   })
