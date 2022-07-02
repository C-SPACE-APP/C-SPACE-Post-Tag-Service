const {associatePostWithTag,getTagsPerPost, getTagCountByTagName, getPostsPerTag, unassociatePostTag} = require('../controllers/controllers')
const {Authorize} = require('../middlewares')
const express = require('express');

// initialize router
const router = express.Router()


router.post('/associatePostWithTag',associatePostWithTag)
router.get('/getTagsPerPost/:postID',getTagsPerPost)
router.get('/getPostsPerTag/:tagName',getPostsPerTag)
router.get('/getTagCount/:tagName',getTagCountByTagName)
router.delete('/unassociatePostTag/:postID',unassociatePostTag)

module.exports = router; 