const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Index Route
router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('index', { posts: posts });
});

// About Route
router.get('/about', (req, res) => {
    res.render('about');
});

// Create Route
router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    await post.save();
    res.redirect('/');
});

// Edit Route
router.get('/edit/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('edit', { post: post });
});

router.post('/edit/:id', async (req, res) => {
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content: req.body.content
    });
    res.redirect('/');
});

// Delete Route
router.post('/delete/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;
