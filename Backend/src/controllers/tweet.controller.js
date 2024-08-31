import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { tweetContent } = req.body

    if (!content || content?.trim().length === 0) {
        throw new ApiError(401," Content is Empty or Invalid")
    }


    const tweet = await Tweet.create({
        content : tweetContent,
        owner :  req.user?._id
    })

    if (!tweet) {
        throw new ApiError(401,"Something went wrong! Try again later.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            "Tweet added successfully"
        )
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Invalid User")
    }

    const userTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1
            }
        }
    ])

    if (!userTweets) {
        throw new ApiError(401, "Unable to fetch User's Tweets! Try again later.")
    }

    return res.status(200)
    .json( new ApiResponse(
        200,
        { userTweets },
        " User Tweets fetched successfully"
    ))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { userContent , userId , createdAt} = req.body

    const updatedContent = await Tweet.findOneAndUpdate(
        {
            owner: userId,
            createdAt
        },
        {
            $set: {content: userContent}
        },
        { new: true }
    )

    if (!updatedContent) {
        throw new ApiError(401, "There was error in updation! Please try again later")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        {updatedContent},
        " Tweet Updated Successfully "
    ))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { userId , createdAt} = req.body

    const deletedTweet = await Tweet.findOneAndDelete(
        {
            owner: userId,
            createdAt
        },
    )

    if (!deletedTweet) {
        return res.status(404).json(new ApiResponse(
            404,
            null,
            "Tweet not found"
        ));
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        { deletedTweet },
        " Tweet Updated Successfully "
    ))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}