//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const port = process.env.PORT || 3000;

const app = express();

let posts = null;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public/"));
app.locals._ = _;

app.get('/', (req, res) => {
    // if (!posts) { var lowerCasedParam = null }
    // else {
    //     function lowerCaseTitle() {
    //         posts.forEach((post) => {
    //             return _.lowerCase(post.title);
    //         });
    //     }
    //     var lowerCasedParam = lowerCaseTitle;
    //     console.log('LCT:' + lowerCaseTitle());
    // }
    const local = {
        posts: posts,
        css: 'css'
        // titleParam: lowerCasedParam
    }
    res.render('home', local);

});

app.get('/about', (req, res) => {
    res.render('about', { css: 'css' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { css: 'css' });
});

app.get('/compose', (req, res) => {
    res.render('compose', { css: 'css' });
});

app.get('/posts', (req, res) => {res.redirect('/')});

app.get('/posts/:postTitle', (req, res) => {
    const postTitleParam = _.lowerCase(req.params.postTitle);
    console.log(postTitleParam);
    if (!posts) {
        res.send(`<h1>Request Error! Contact the Developer and Report Server Bugs</h1>`);
    }
    else {
        posts.forEach((post) => {
            const postTitle = _.lowerCase(post.title);
            const postContent = post.content;
            if (postTitle === postTitleParam) {
                res.render('post', {
                    title: post.title,
                    content: postContent,
                    css: '../css'
                });
            }
            // else {
            //     res.send(`<h1>Error! Status Code: ${res.statusCode}</h1>`);
            // }
        });
    }
});

app.post('/compose', (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postContent
    }
    //console.log(post);
    if (!posts) { posts = [] }
    posts.push(post);
    console.log(posts);
    res.redirect('./');
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
