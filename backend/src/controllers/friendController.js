const { prisma } = require("../../models/prismaClient");

// GET /api/friends
async function getFriendsData(req, res, next) {
    try {
        const currentUserId = Number(req.header("x-user-id"));

        if (!currentUserId || currentUserId === -1) {
            res.status(401);
            throw new Error("Unauthorized access", { requestedUserId: currentUserId });
        }

        const allConnections = await prisma.friend.findMany({
            where: {
                OR: [
                    { userId: currentUserId },
                    { FriendId: currentUserId }
                ]
            },
            include: {
                user: { select: { userId: true, username: true } },     
                friend: { select: { userId: true, username: true } }    
            }
        });

        const friends = [];
        const pendingSent = [];
        const pendingReceived = [];
        const excludedUserIds = [currentUserId];

        allConnections.forEach(connection => {
            const isSender = connection.userId === currentUserId;
            const otherUser = isSender ? connection.friend : connection.user;
            excludedUserIds.push(otherUser.userId);

            if (connection.accepted) {
                friends.push(otherUser);
            } else {
                if (isSender) {
                    pendingSent.push(otherUser);
                } else {
                    pendingReceived.push(otherUser);
                }
            }
        });

        const availableUsers = await prisma.user.findMany({
            where: {
                userId: { notIn: excludedUserIds } 
            },
            select: { userId: true, username: true }
        });

        // Wrapped all arrays inside 'data' and explicitly set error to null
        res.status(200).json({
            success: true,
            data: {
                friends: friends,
                pendingSent: pendingSent,
                pendingReceived: pendingReceived,
                availableUsers: availableUsers
            },
            error: null
        });

    } catch (err) {
        next(err);
    }
}

// POST /api/friends
async function sendFriendRequest(req, res, next) {
    try {
        const currentUserId = Number(req.header("x-user-id"));
        const targetUserId = Number(req.body.targetUserId);

        if (currentUserId === targetUserId) {
            res.status(400);
            throw new Error("Cannot add yourself", { targetUserId: targetUserId });
        }

        const newRequest = await prisma.friend.create({
            data: {
                userId: currentUserId,
                FriendId: targetUserId,
                accepted: false
            }
        });

        res.status(201).json({ success: true, data: newRequest, error: null });
    } catch (err) {
        next(err);
    }
}

// PUT /api/friends/accept
async function acceptFriendRequest(req, res, next) {
    try {
        const currentUserId = Number(req.header("x-user-id"));
        const senderUserId = Number(req.body.senderUserId);

        const updatedFriendship = await prisma.friend.update({
            where: {
                userId_FriendId: {
                    userId: senderUserId,       
                    FriendId: currentUserId     
                }
            },
            data: {
                accepted: true
            }
        });

        // Matching the userController check for successful updates
        if (!updatedFriendship) {
            res.status(404);
            throw new Error("Friend request not found", { senderUserId: senderUserId });
        }

        res.status(200).json({ success: true, data: updatedFriendship, error: null });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/friends/:id
async function deleteFriendConnection(req, res, next) {
    try {
        const currentUserId = Number(req.header("x-user-id"));
        const targetUserId = Number(req.params.id);

        await prisma.friend.deleteMany({
            where: {
                OR: [
                    { userId: currentUserId, FriendId: targetUserId },
                    { userId: targetUserId, FriendId: currentUserId }
                ]
            }
        });

        // Return the targetUserId in data, matching deleteUser logic
        res.status(200).json({ success: true, data: targetUserId, error: null });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getFriendsData,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriendConnection
};