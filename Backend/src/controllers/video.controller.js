import mongoose , {isValidObjectId} from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { destroyFile, uploadOnCloudinary } from "../utils/cloudinaryFileHandling.js"

const getAllVideos = asyncHandler( async(req , res) => {
    let { page = 1 , limit = 10 , query , sortBy = 'createdAt' , sortType , userId } = req.query
    
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    sortDirection = sortType === "asc" ? 1 : -1;
    const filter = {};

    if (query) {
        // assuming search by title , case insensitive
        filter.title = {
            $regex: query,
            $options: "i"
        }
    }
    if (userId) {
        filter.userId = userId;
    }

    const allVideos = Video.aggregate([
        {
            $match: filter,
        },
        {
            $sort: {
                [sortBy]: sortDirection
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limits: limit
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                'userDetails.username': 1,
                'userDetails.avatar': 1
            }
        }
    ])
    
    if(!allVideos || allVideos.length === 0){
        return res.status(200).json(new ApiResponse(200, [], "No videos found"))
    }

    res.status(200)
    .json( new ApiResponse (
        200,
        { page , limit , allVideos },
        "All Videos Fetched successfully"
    ))

})

const publishAVideo = asyncHandler( async(req , res) => {
    const { title , description} = req.body
    const videoFileLocalPath = req.file?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.file?.thumbnail?.[0]?.path;

    console.log(req)
    console.log(req.file)
    console.log(req.file.avatar)
    console.log(title)

    if (!videoFileLocalPath) throw new ApiError(400, "Invalid  videoFile file path");

    if (!thumbnailLocalPath) throw new ApiError(400, "Invalid  thumbnail file path");
    
    if (!description || description.trim().length==0) throw new ApiError(400,"Invalid or empty Description");
    
    if (!title || title.trim().length === 0) throw new ApiError(400,"Invalid or empty Title");

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    if (!videoFile) throw new ApiError(500,"Something Went Wrong while uploading video!");

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) throw new ApiError(500,"Something Went Wrong while uploading thumbnail!");
    
    console.log(videoFile);
    console.log(thumbnail);

    const uploadFile = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        // views: videoFile.views,   --> no need since no views while publishing
        isPublished: true,
        owner: req.user?._id
    })

    if (!uploadFile) throw new ApiError(404, "Error while uploading on ")

    return res.status(200)
    .json(new ApiResponse(
        200,
        {uploadFile},
        "Video Published SuccessFully"
    ))
})

const getVideoById = asyncHandler( async(req , res) => {
    const { videoId } = req.params
    
    if (!isValidObjectId(videoId)) throw new ApiError(400 , "Invalid ID");

    const currVideo = await Video.findOne({
        owner: req.user?._id,
        _id: videoId
    })

    if (!currVideo) throw new ApiError(404, "Error fetching requested video");

    return res.status(200)
    .json(new ApiResponse(
        200,
        {currVideo},
        "Video fetched successfully"
    ))
})

// Could be Improved and broken down to 2 different functions
const updateVideo = asyncHandler( async(req , res) => {
    // Todo: update video details like title, description, thumbnail

    const { videoId } = req.params
    const { title , description} = req.body
    const thumbnailLocalPath = req.file?.thumbnail?.[0]?.path;
    const thumbnailPath = req.file?.path
    console.log(thumbnailLocalPath)
    console.log(thumbnailPath)
    
    if (!isValidObjectId(videoId)) throw new ApiError(400,"Invalid video ID")

    if (!thumbnailLocalPath) throw new ApiError(400, "Invalid  thumbnail file path");
    
    if (!description || description.trim().length==0) throw new ApiError(400,"Invalid or empty Description");
    
    if (!title || title.trim().length === 0) throw new ApiError(400,"Invalid or empty Title");

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "No video found")

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "You cannot edit the video because you are not the owner.");
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailPath)
    if (!thumbnail) throw new ApiError(500, "Thumbnail is required!")

    const updateFields = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {title, description, thumbnail: thumbnail.url}
        },
        {new: true}
    )

    if (!updateFields) throw new ApiError(400, "Unable to update details");
    
    return res.status(200)
    .json(new ApiResponse(
        200,
        {updateFields},
        "Details updated successfully"
    ))
})

const deleteVideo = asyncHandler( async(req , res) => {
    const { videoId } = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "Only the owner of the video can delete the video");
    }

    const deletevideo = await Video.findByIdAndDelete(videoId);
    if (!deletevideo) {
        throw new ApiError(404, "Video couldnt be deleted");
    }


    // Could store the public_id of video in videoFile while designing the VIDEO Schema
    try {
        await destroyFile(video?.videoFile)
    } catch (error) {
        console.log("Error deleting videoFile : ",error)
    }
    try {
        await destroyFile(video?.thumbnail)
    } catch (error) {
        console.log("Error deleting thumbnail : ",error)
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { deletevideo }, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400,"Invalid video ID")

    const video = await Video.findById(videoId);
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only the owner of the video can toggle publish status");
    }

    const toggle = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished,
            },
        },
        { new: true },
    );

    if (!toggle) throw new ApiError(400, "Failed to toggle publish status");
    
    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            { toggle },
            "Video published toggle successfully"
        ));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}