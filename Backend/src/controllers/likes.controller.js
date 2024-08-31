import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id

    if(!isValidObjectId(videoId)) {
        return new ApiError(400, "Invalid Video ID")
    }

    // const likedVideo = await Like.findOne({
    //     $and: [
    //         { video: videoId },
    //         { likedBy: req.user?._id }
    //     ]
    // });

    const likedVideo = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    let isAlreadyLiked = false;
    if (likedVideo) {
        // await Like.deleteOne({ _id: likedVideo._id })
        
        await Like.deleteOne({
            video: videoId,
            likedBy: userId
        })
        isAlreadyLiked = false;
    }
    else {
        await Like.create({
            video: videoId,
            likedBy: userId
        })
        isAlreadyLiked = true;
    }

    return res.status(200
        .json( new ApiResponse(
            200,
            { isAlreadyLiked },
            "Video like Toggled Successfully"
        ))
    );
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user?._id

    if(!isValidObjectId(commentId)) {
        return new ApiError(400, "Invalid Comment ID")
    }

    const likedComment = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    let isAlreadyLiked = false;
    if (likedComment) {
        await Like.deleteOne({
            comment: commentId,
            likedBy: userId
        })
        isAlreadyLiked = false;
    }
    else {
        await Like.create({
            comment: commentId,
            likedBy: userId
        })
        isAlreadyLiked = true;
    }

    return res.status(200
        .json( new ApiResponse(
            200,
            { isAlreadyLiked },
            "Comment like Toggled Successfully"
        ))
    );

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user?._id

    if(!isValidObjectId(tweetId)) {
        return new ApiError(400, "Invalid Tweet ID")
    }

    const likedTweet = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    let isAlreadyLiked = false;
    if (likedTweet) {
        await Like.deleteOne({
            tweet: tweetId,
            likedBy: userId
        })
        isAlreadyLiked = false;
    }
    else {
        await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
        isAlreadyLiked = true;
    }

    return res.status(200
        .json( new ApiResponse(
            200,
            { isAlreadyLiked },
            "Tweet like Toggled Successfully"
        ))
    );
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    try {
        const likedVideosList = await Like.aggregate([
            {
                $match : {
                    likedBy: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "likedList"
                }
            },
            {
                $addFields: {
                    videosLikedByUser: {
                        $size: "likedList"
                    }
                }
            },
            {
                $project: {
                    likedList: 1,
                    videosLikedByUser: 1,
                    thumbnail: 1,
                    title: 1,
                    likedBy: 1
                }
            }
        ])

    } catch (error) {
        throw new ApiError(200 , "Unable to fetch the list of liked videos" , error)
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        likedVideosList[0],
        "Fetched all the liked videos successfully"
    ))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}