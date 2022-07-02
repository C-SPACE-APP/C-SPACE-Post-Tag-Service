const establishConnection = require('../utils/establishConnection')

const associatePostWithTag = async (req,res) => {
    const reqLength = Object.keys(req.body).length
    const {postID,tagNameArray} = req.body
    let postPayload,duplicateChecker
    
    // request validation, if either title,description, or username is not included in the request parameters,
    // the request will fail.
    if(reqLength != 2 || !postID || !tagNameArray)
        return res.status(400).json({message:"Bad request"})

    if(tagNameArray.isArray)
        if(tagNameArray.length === 0)
            return res.status(400).json({message:"Request body has an array of tag ID with length zero"})
    else
        return res.status(400).json({message:"tagNameArray is not an array"})
    
    let connection = await establishConnection(false)
    try
    {
        for(let iterator = 0; iterator < tagNameArray.length; iterator++)
        {
            duplicateChecker = await connection.execute("SELECT * FROM PostTagService.PostTag WHERE PostTagService.PostTag.postID = ? AND PostTagService.PostTag.tagName = ?",[postID,tagNameArray[iterator]])
            if(duplicateChecker[0].length > 0)
                return res.status(403).json({message:"Selected post has a duplicate tag associated with it"})
            postPayload = await connection.execute("INSERT INTO PostTagService.PostTag VALUES (?,?)",[postID,tagNameArray[iterator]])
        }
            
    }
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()
    return res.status(200).json({returnData:postPayload,message:"Successfully associated post with tag(s)!"}) 
}

const getTagsPerPost = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {postID} = req.params
    let tagNameArray
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if(reqLength != 1 || !postID)
        return res.status(400).json({
            message:"Bad request"
        })
    
    let connection = await establishConnection(false)
    
    try
    {
        postArr = await connection.execute("SELECT tagName FROM PostTagService.PostTag WHERE postID = ?",[postID])
        tagNameArray = postArr[0].map(
            (value) =>
            {
                return value["tagName"]
            })
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:tagNameArray})
    else
        res.status(200).json({returnData:false})
}


const getPostsPerTag = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {tagName} = req.params
    let postArr
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if(reqLength != 1 || !tagName)
        return res.status(400).json({
            message:"Bad request"
        })
    
    let connection = await establishConnection(false)
    
    try
    {
        postArr = await connection.execute("SELECT * FROM PostTagService.PostTag INNER JOIN InteractionService.interaction ON PostTagService.posttag.postID = InteractionService.interaction.postID WHERE PostTagService.posttag.tagName = ? AND InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.parentID IS NULL",[tagName])
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (postArr)
        res.status(200).json({returnData:postArr[0]})
    else
        res.status(200).json({returnData:false})
}


const getTagCountByTagName = async (req,res) => {
    const reqLength = Object.keys(req.params).length
    const {tagName} = req.params
    let returnValue, tagCount
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if(reqLength != 1 || !tagName)
        return res.status(400).json({
            message:"Bad request"
        })
    
    let connection = await establishConnection(true)
    
    try
    {
        returnValue = await connection.execute("SELECT COUNT(tagName) AS tagCount FROM PostTagService.PostTag WHERE PostTagService.PostTag.tagName = ? GROUP BY PostTagService.PostTag.tagName",[tagName])
        tagCount = returnValue[0][0]["tagCount"]
    }   
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()

    // returns either true or false depending if the credentials matched with the database
    if (tagCount)
        res.status(200).json({returnData:tagCount})
    else
        res.status(200).json({returnData:false})
}


module.exports = {associatePostWithTag,getTagsPerPost,getTagCountByTagName,getPostsPerTag}