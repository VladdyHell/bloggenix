//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public/"));
app.locals._ = _;

mongoose.connect("mongodb+srv://admin-vladd:VladdyHell007@cluster0.9u8lm.mongodb.net/blogpostsDB");

const postsSchema = {
    title: String,
    content: String
}

const Post = mongoose.model("Post", postsSchema);

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

    Post.find({}, (err, foundPosts) => {
        const local = {
            posts: foundPosts,
            css: 'css'
            // titleParam: lowerCasedParam
        }
        err ? console.log(err) : console.log("Found Posts"); res.render('home', local);
    });

});

app.get('/about', (req, res) => {
    res.render('about', { css: 'css' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { css: 'css' });
});

app.get('/compose', (req, res) => {
    res.render('compose', { css: 'css' });
    Post.find({}, (err, posts) => {
        console.log(posts);
    });
});

app.get('/posts', (req, res) => { res.redirect('/') });

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
    Post.exists({ title: _.lowerCase(post.title) }, (err, foundPost) => {
        err ? console.log(err) : foundPost ? console.log("Exists!") : Post.create(post, err => {
            err ? console.log(err) : console.log(`Successfully saved ${post.title} to the database`)
            res.redirect('./');
        });
    });
    // posts.push(post);
    // console.log(posts);
    // res.redirect('./');
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
