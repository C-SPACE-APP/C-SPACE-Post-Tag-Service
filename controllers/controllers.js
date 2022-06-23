const establishConnection = require('../utils/establishConnection')
const axios = require('axios')

const createPost = async (req,res) => {
    const reqLength = Object.keys(req.body).length
    const {title, description,userID} = req.body
    let postPayload
    
    // request validation, if either title,description, or username is not included in the request parameters,
    // the request will fail.
    if(reqLength != 3 || !title || !description || !userID)
        return res.status(400).json({message:"Bad request"})
    
    let connection = await establishConnection(true)
    try
    {
        postPayload = await connection.execute("INSERT INTO Post VALUES (0,?,?,CURDATE(),CURDATE())",[title,description])
        postID = postPayload[0]["insertId"]
        // axios call to interaction (creating new data for interaction)
        await axios({
            method: 'post',
            data:{
                userID:userID,
                postID:postID
            },
            url: 'http://localhost:3005/createPostInteraction/'
        })
    }
    catch(err)
    {
        await connection.destroy()
        return res.status(400).json({returnData:null,message:`${err}`})
    }
    await connection.destroy()
    return res.status(200).json({returnData:postPayload,message:"Successfully created post!"}) 
}

const getPostsByPage = async (req,res) => {
    const reqLength = Object.keys(req.body).length
    const {pageNumber,limitPerPage} = req.params
    const lowerLimit = (pageNumber - 1) * limitPerPage + 1 
    const upperLimit = pageNumber * limitPerPage
    // request validation, if either username or password is not included in the request parameters,
    // the request will fail.
    if(reqLength != 2 || !pageNumber || !limitPerPage)
        return res.status(400).json({
            message:"Bad request"
        })
    
    let connection = await establishConnection(true)
    
    try
    {
        postArr = await connection.execute("SELECT * FROM InteractionService.interaction LEFT JOIN PostService.post ON InteractionService.interaction.postID = PostService.post.postID WHERE InteractionService.interaction.commentID IS NULL AND InteractionService.interaction.replyID IS NULL AND InteractionService.interaction.postID >= ? AND InteractionService.interaction.postID <= ?",[lowerLimit,upperLimit])
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



module.exports = {createPost,getPostsByPage}