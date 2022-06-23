const {createPost,getPostsByPage} = require('../controllers/controllers')
const {Authorize} = require('../middlewares')
const express = require('express');

// initialize router
const router = express.Router()


router.post('/createPost',createPost)
router.get('/getPostsByPage/:pageNumber/:limitPerPage',getPostsByPage)
// router.get('/getPostsDescending',getPostsDescending)

module.exports = router; 