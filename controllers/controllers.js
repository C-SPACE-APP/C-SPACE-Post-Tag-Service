const establishConnection = require('../utils/establishConnection')
const axios = require('axios')

const associatePostWithTag = async (req,res) => {
    const reqLength = Object.keys(req.body).length
    const {postID,tagIDArray} = req.body
    let postPayload,duplicateChecker
    
    // request validation, if either title,description, or username is not included in the request parameters,
    // the request will fail.
    if(reqLength != 2 || !postID || !tagIDArray)
        return res.status(400).json({message:"Bad request"})

    if(tagIDArray.isArray)
        if(tagIDArray.length === 0)
            return res.status(400).json({message:"Request body has an array of tag ID with length zero"})
    else
        return res.status(400).json({message:"tagIDArray is not an array"})
    
    let connection = await establishConnection(true)
    try
    {
        for(let iterator = 0; iterator < tagIDArray.length; iterator++)
        {
            duplicateChecker = await connection.execute("SELECT * FROM PostTag WHERE postID = ? AND tagID = ?",[postID,tagIDArray[iterator]])
            if(duplicateChecker[0].length > 0)
                return res.status(403).json({message:"Selected post has a duplicate tag associated with it"})
            postPayload = await connection.execute("INSERT INTO PostTag VALUES (?,?)",[postID,tagIDArray[iterator]])
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
    let tagIDArray,fullDetails
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if(reqLength != 1 || !postID)
        return res.status(400).json({
            message:"Bad request"
        })
    
    let connection = await establishConnection(true)
    
    try
    {
        postArr = await connection.execute("SELECT tagID FROM PostTagService.PostTag WHERE postID = ?",[postID])
        tagIDArray = postArr[0].map(
            (value) =>
            {
                return value["tagID"]
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
        res.status(200).json({returnData:fullDetails})
    else
        res.status(200).json({returnData:false})
}



module.exports = {associatePostWithTag,getTagsPerPost}