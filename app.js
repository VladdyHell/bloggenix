//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const striptags = require('striptags');
const api_auth = require(__dirname + '/MongooseAPI&Auth.js');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public/"));
app.locals._ = _;
app.locals.striptags = striptags;

mongoose.connect(api_auth.getAPI());

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
        // foundPosts.forEach();
        const local = {
            posts: foundPosts,
            css: 'css',
            homeHref: './',
            aboutHref: './about',
            contactHref: './contact'
            // titleParam: lowerCasedParam
        }
        err ? console.log(err) : console.log("Found Posts"); res.render('home', local);
    });

});

app.get('/about', (req, res) => {
    res.render('about', {
        css: 'css',
        homeHref: './',
        aboutHref: './about',
        contactHref: './contact'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        css: 'css',
        homeHref: './',
        aboutHref: './about',
        contactHref: './contact'
    });
});

app.get('/compose', (req, res) => {
    res.render('compose', {
        css: 'css',
        homeHref: './',
        aboutHref: './about',
        contactHref: './contact'
    });
    // Post.find({}, (err, posts) => {
    //     console.log(posts);
    // });
});

app.get('/posts', (req, res) => { res.redirect('/') });

app.get('/posts/:postID', (req, res) => {
    const postID = req.params.postID;
    Post.findOne({ _id: postID }, (err, foundPost) => {
        const postTitle = foundPost.title;
        const postContent = foundPost.content;
        // console.log(postContent);
        res.render('post', {
            title: postTitle,
            content: postContent,
            postID: postID,
            css: '../css',
            homeHref: '../',
            aboutHref: '../about',
            contactHref: '../contact'
        });
    });
    console.log(postID);
});

app.post('/compose', (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postContent,
        postID: req.body.submitID
    }
    //console.log(post);
    Post.findOne({ title: /* _.lowerCase( */post.title/* ) */ }, (err, foundPost) => {
        err ? console.log(err) : (foundPost ? res.send(`The Title ${foundPost.title} Already Exists!`) : Post.create(post, err => {
            err ? console.log(err) : console.log(`Successfully saved ${post.title} to the database`);res.redirect('./');
        }));
    });
    // posts.push(post);
    // console.log(posts);
    // res.redirect('./');
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
