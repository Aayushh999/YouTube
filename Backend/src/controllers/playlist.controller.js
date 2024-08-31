import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description, userId} = req.body

    if (!isValidObjectId(userId)) {
        throw new ApiError(401 , " Invalid user ")
    }

    const newPlaylist = await Playlist.create({
        name: name || "" ,
        description: description || "",
        videos: null,
        owner: userId
    })

    if (!newPlaylist) {
        throw new ApiError(404 , " Could'nt create playlist at the moment ")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        {newPlaylist},
        "Playlist Created successfully"
    ))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid userID")
    }

    const allPlaylists = await Playlist.find({
        owner: userId
    })

    if (!allPlaylists || allPlaylists.length === 0) {
        throw new ApiError(404, "Cant find any playlist")
    }

    return res.status(200)
    .json(new ApiResponse(200, allPlaylists , "Playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if (!playlistId) {
        throw new ApiError(404 , " Invalid ID ")
    }

    const currPlaylist = await Playlist.findById(playlistId)

    if( !currPlaylist ) {
        throw new ApiError(404, " Could'nt find the playlist ")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        currPlaylist,
        " Playlist fetched Succesfully "
    ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    //  Step 1 - get playlist and check if id is correct or not?
    //  step 2 - check if playlist exist or not 
    //  step 3 - check if user is authorised or not 
    //  step 4 - find the video details object using aggregation

    if (!isValidObjectId(videoId)) throw new ApiError(404, " Invalid video ID ")
    if (!mongoose.Types.ObjectId(playlistId)) throw new ApiError(404, " Invalid playlist ID ")

    const currentPlaylist = Playlist.findById(playlistId)
    if (!currentPlaylist) throw new ApiError(404, " Could'nt find Playlist ")

    if (currentPlaylist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, " U are not authorised to add video to playlist ")
    }

    const addedVideo = Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foriegnFeild: "_id",
                as: "videoDetails",
                pipeline: [
                    {
                        $project: {
                            _id:1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id:1,
                thumbnial:1,
                title:1,
                description:1,
                duration:1,
                views:1,
                owner:1,
            }
        }
    ])

    if (!addedVideo || addedVideo.length === 0) {
        throw new ApiError(501, "No such video found");
    }

    currentPlaylist.videos.push(addedVideo[0]);
    await currentPlaylist.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, currentPlaylist, "Video added successfully")
    );

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(404, " Invalid video ID ")
        if (!mongoose.Types.ObjectId(playlistId)) throw new ApiError(404, " Invalid playlist ID ")
    
        const currentPlaylist = Playlist.findById(playlistId)
        if (!currentPlaylist) throw new ApiError(404, " Could'nt find Playlist ")
    
        if (currentPlaylist.owner.toString() !== req.user?._id.toString()) {
            throw new ApiError(401, " U are not authorised to add video to playlist ")
        }
    
        if (!addedVideo || addedVideo.length === 0) {
            throw new ApiError(501, "No such video found");
        }
    
        currentPlaylist.videos = currentPlaylist.videos.filter((obj) => {obj._id.toString() !== videoId})
        await currentPlaylist.save({ validateBeforeSave: false });
    
        res.status(200).json(
            new ApiResponse(200, currentPlaylist, "Video removed successfully")
        );
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if (!isValidObjectId(userId)) {
        throw new ApiError(401 , " Invalid request ")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only the valid owner can change playlist");
    }

    const deleted = await Playlist.findByIdAndDelete(playlistId)

    if( !deleted ) {
        throw new ApiError(404, " Could'nt delete the playlist ")
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        deleted,
        " Playlist deleted Succesfully "
    ))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    if (!description || description.length === 0) {
        throw new ApiError(400, "Description cannot be empty");
    }

    if (!name || name.length === 0) {
        throw new ApiError(400, "Playlist name cannot be empty");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only the valid owner can change playlist");
    }

    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : { name,description}
        },
        { new: true }
    )

    if (!updated) {
        throw new ApiError(500, "Playlist cannot be updated now. Try again later");
    }

    return res.status(200)
    .json(new ApiResponse(200, "Playlist updated successfully", {}));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}