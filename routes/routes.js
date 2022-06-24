const {associatePostWithTag,getTagsPerPost} = require('../controllers/controllers')
const {Authorize} = require('../middlewares')
const express = require('express');

// initialize router
const router = express.Router()


router.post('/associatePostWithTag',associatePostWithTag)
router.get('/getTagsPerPost/:postID',getTagsPerPost)


module.exports = router; 