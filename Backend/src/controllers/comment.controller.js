import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page)
    limit = parseInt(limit)

    if (!videoId) {
        throw new ApiError(401, "Invalid Video ID");
    }

    const getVideo = await Video.findById(videoId);
    if (!getVideo) {
        throw new ApiError(404, "Video not found");
    }

    const skip = (page - 1) * limit;

    const videoComments = await Comment.find({ video: videoId })
        .populate('owner', 'username')
        .sort({ createdAt: -1 })  // Sort by latest comments first
        .skip(skip)  // Skip the previous pages
        .limit(limit);  // Limit the number of comments returned

    const totalComments = await Comment.countDocuments({ video: videoId });
    // const totalComments = await Comment.find({ video: videoId }).count()

    return res.status(200).json(new ApiResponse(
        200,
        {
            comments: videoComments,
            totalComments,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit)
        },
        "Comments retrieved successfully"
    ));
});


const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body
    const userId = req.user?.userId

    if (!content || content?.trim().length === 0) {
        throw new ApiError(401," Content is Empty or Invalid")
    }

    if (!userId || !videoId) {
        throw new ApiError(404 , "Invalid request")
    }

    const getVideo = await Video.findById(videoId);
    if (!getVideo) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content: content?.trim(),
        video: videoId,
        owner: userId
    })

    if (!comment) {
        throw new ApiError(400, "Something went wrong while adding comment!")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        comment,
        " Comment added successfully "
    ))
})

const updateComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { updatedContent , createdAt } = req.body
    const userId = req.user?.userId

    if (!updatedContent || updatedContent?.trim().length === 0) {
        throw new ApiError(401," Content is Empty or Invalid")
    }

    if (!userId || !videoId) {
        throw new ApiError(404 , "Invalid request")
    }

    const getVideo = await Video.findById(videoId);
    if (!getVideo) {
        throw new ApiError(404, "Video not found");
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
            createdAt,
            video: videoId,
            owner: userId
        },
        {
            $set: {content: updatedContent.trim()}
        },
        {
            new: true
        }
    )

    if (!updatedComment) {
        throw new ApiError(400, "Something went wrong while updating comment!")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        updatedComment,
        " Comment updated successfully "
    ))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content , createdAt} = req.body
    const userId = req.user?.userId

    // if (!content || content?.trim().length === 0) {
    //     throw new ApiError(401," Content is Empty or Invalid")
    // }

    if (!userId || !videoId) {
        throw new ApiError(404 , "Invalid request")
    }

    // const getVideo = await Video.findById(videoId);
    // if (!getVideo) {
    //     throw new ApiError(404, "Video not found");
    // }

    const comment = await Comment.findOneAndDelete({
        content,
        video: videoId,
        owner: userId,
        createdAt
    })

    if (!comment) {
        return res.status(404).json(new ApiResponse(
            404,
            null,
            "Comment not found"
        ));
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        comment,
        " Comment deleted successfully "
    ))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}