import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!isValidObjectId(channelId)) {
        return new ApiError(400, "Invalid channelId")
    }

    const userId = req.user?._id;

    if(!isValidObjectId(userId)) {
        return new ApiError(400, "Invalid UserId")
    }

    const userSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })

    let isSubscribed = false;
    if (userSubscription) {
        // await Subscription.deleteOne({
        //     channel: channelId,
        //     subscriber: userId
        // })

        // check the Id if it was same the as when creating the above document
        await Subscription.deleteOne({ _id: userSubscription._id})
        isSubscribed = false;
    }
    else {
        await Subscription.create({
            channel: channelId,
            subscriber: userId
        })
        isSubscribed = true;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { isSubscribed },
            "Subscription toggled successfully"
        )
    );
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!channelId) {
        throw new ApiError(400, "Channel ID is Missing or Invalid");
    }

    const userId = req.user?._id;

    //approach 1
    const channelSubscribers = await User.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subsCount"
            }
        },
        {
            $addFields: {
                totalSubscribers: {
                    $size: "$subsCount"
                }
            }
        },
        {
            $project: {
                totalSubscribers:1,
                subsCount: {
                    _id: 1,
                    fullname: 1,
                    username: 1,
                }
            }
        }
    ])

    if (!channelSubscribers?.length) {
        throw new ApiError(404, "Channel does not exists")
    }
    console.log(channelSubscribers);

    return res.status(200)
    .json(new ApiResponse(
        200,
        channelSubscribers[0], " Subscribers fetched Successfully "
    ))

    // Approach 2
    /*
    const subscriberCount = await Subscription.countDocuments({
        channel: channelId
    });

    if (!subscriberCount) {
        throw new ApiError(404, "Channel does not exist");
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        { subscriberCount },
        "Subscribers fetched successfully"
    ));
    */
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channelsSubscribedTo = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriberId",
                foreignField: "_id",
                as: "totalSubscription"
            }
        },
        {
            $addFields: {
                channelsSubscribed: {
                    $size: "$totalSubscription"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false, 
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                channelsSubscribed: 1,
                avatar: 1,
                isSubscribed: 1,
            }
        }
    ])

    console.log( "Users Subscriptions: ",channelsSubscribedTo);
    if(!channelsSubscribedTo || channelsSubscribedTo.length === 0 ) {
        return res.status(200)
        .json(new ApiResponse(200 , {channelsSubscribed: 0} , "No current Subscriptions to show" ));
    }
    

    return res.status(200)
        .json(new ApiResponse(
            200,
            channelsSubscribedTo[0],
            "No current Subscriptions to show" 
        ));

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}