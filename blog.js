const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Post = require('../models/post');

// Index Route with Pagination
router.get('/', async (req, res) => {
    const perPage = 5;
    const page = req.query.page || 1;

    try {
        const posts = await Post.find()
            .skip((perPage * page) - perPage)
            .limit(perPage);
        const count = await Post.countDocuments();

        res.render('index', {
            posts: posts,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (err) {
        req.flash('error_msg', 'Error retrieving posts.');
        res.redirect('/');
    }
});

// About Route
router.get('/about', (req, res) => {
    res.render('about');
});

// Create Route
router.get('/create', (req, res) => {
    res.render('create');
});

router.post('/create', [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('content').not().isEmpty().withMessage('Content is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('create', {
            errors: errors.array()
        });
    }

    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    try {
        await post.save();
        req.flash('success_msg', 'Post created successfully.');
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Error creating post.');
        res.redirect('/create');
    }
});

// Edit Route
router.get('/edit/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('edit', { post: post });
    } catch (err) {
        req.flash('error_msg', 'Error retrieving post.');
        res.redirect('/');
    }
});

router.post('/edit/:id', [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('content').not().isEmpty().withMessage('Content is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('edit', {
            errors: errors.array(),
            post: { _id: req.params.id, title: req.body.title, content: req.body.content }
        });
    }

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        });
        req.flash('success_msg', 'Post updated successfully.');
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Error updating post.');
        res.redirect(`/edit/${req.params.id}`);
    }
});

// Delete Route
router.post('/delete/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Post deleted successfully.');
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Error deleting post.');
        res.redirect('/');
    }
});

module.exports = router;
