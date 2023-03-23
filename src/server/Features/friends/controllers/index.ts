import friendsService from "../use-cases";
import makeAddFriendController from "./add-friends";
import makeDeleteFriendController from "./delete-friend";
import makeGetAFriendController from "./get-aFriend";
import makeGetFriendsController from "./get-Friends";

const addFriendController = makeAddFriendController({
    addFriend: friendsService.addFriend,
});
const deleteFriendController = makeDeleteFriendController({
    deleteFriend: friendsService.deleteFriend,
});
const getAFriendController = makeGetAFriendController({
    getAFriend: friendsService.getAFriend,
});
const getFriendsController = makeGetFriendsController({
    getFriends: friendsService.getFriends,
});

const friendsControllers = Object.freeze({
    addFriendController,
    deleteFriendController,
    getAFriendController,
    getFriendsController,
});

export default friendsControllers;

export {
    addFriendController,
    deleteFriendController,
    getAFriendController,
    getFriendsController,
};
