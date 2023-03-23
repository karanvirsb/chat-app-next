import makeAddFriend from "./addFriend";
import friendsDb from "../data-access";
import makeDeleteFriend from "./deleteFriend";
import makeGetAFriend from "./getAFriend";
import makeGetFriends from "./getFriends";

const addFriend = makeAddFriend({ friendsDb });
const deleteFriend = makeDeleteFriend({ friendsDb });
const getAFriend = makeGetAFriend({ friendsDb });
const getFriends = makeGetFriends({ friendsDb });

const friendsService = Object.freeze({
    addFriend,
    deleteFriend,
    getAFriend,
    getFriends,
});

export default friendsService;

export { addFriend, deleteFriend, getAFriend, getFriends };
