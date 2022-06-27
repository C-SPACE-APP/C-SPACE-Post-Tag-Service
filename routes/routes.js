const {associatePostWithTag,getTagsPerPost, getTagCountByTagName} = require('../controllers/controllers')
const {Authorize} = require('../middlewares')
const express = require('express');

// initialize router
const router = express.Router()


router.post('/associatePostWithTag',associatePostWithTag)
router.get('/getTagsPerPost/:postID',getTagsPerPost)
router.get('/getTagCount/:tagName',getTagCountByTagName)

module.exports = router; 