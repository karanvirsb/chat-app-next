import { IUser } from "@/server/Features/user/user";

import { IGroup } from "../../src/Hooks/groupHooks";

export function isGroupArray(
  arr: IGroup[] | string | undefined
): arr is IGroup[] {
  if (arr === undefined) return false;
  return (arr as IGroup[]).map !== undefined;
}

export function isGroup(item: IGroup | string | undefined): item is IGroup {
  if (item === undefined) return false;
  return (item as IGroup).groupId !== undefined;
}

export function areGroupUsers(
  item: IUser[] | string | undefined
): item is IUser[] {
  if (item === undefined) return false;
  return (item as IUser[]).map !== undefined;
}
