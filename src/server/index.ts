import setupFriendsDb from "./Features/friends/db";
import setupGroupDb from "./Features/group/db";
import setupChannelDb from "./Features/groupChannel/db";
import setupMessageDb from "./Features/groupMessage/db";
import setupPrivateChannelDb from "./Features/privateChannel/db";
import setupPrivateMessageDb from "./Features/privateMessage/db";
import setupUserDb from "./Features/user/db";
import sleep from "./Utilities/sleep";

try {
  await setupUserDb();
  await sleep(1000);

  await setupGroupDb();
  await sleep(1000);

  await setupChannelDb();
  await sleep(1000);

  await setupPrivateChannelDb();
  await sleep(1000);

  await setupMessageDb();
  await sleep(1000);

  await setupPrivateMessageDb();
  await sleep(1000);

  await setupFriendsDb();
} catch (error) {
  console.log(error);
}
