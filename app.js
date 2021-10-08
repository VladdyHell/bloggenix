//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const port = process.env.PORT || 3000;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
        post: homeStartingContent,
        posts: posts,
        css: 'css'
        // titleParam: lowerCasedParam
    }
    res.render('home', local);

});

app.get('/about', (req, res) => {
    res.render('about', { post: aboutContent, css: 'css' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { post: contactContent, css: 'css' });
});

app.get('/compose', (req, res) => {
    res.render('compose', { css: 'css' });
});

app.get('/posts/:postTitle', (req, res) => {
    const postTitleParam = _.lowerCase(req.params.postTitle);
    console.log(postTitleParam);
    if (!posts) {
        res.send("404 Not Found");
    }
    else {
        posts.forEach((post) => {
            const postTitle = _.lowerCase(post.title);
            const postContent = post.content;
            if (postTitle === postTitleParam) {
                res.render('post', {
                    title: post.title,
                    content: postContent,
                    css: '/css',
                });
            }
            // else {
            //     res.send("404 Not Found");
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
    res.redirect('/');
});

app.listen(port, function () {
    console.log(`Server started on port ${port}`);
});
