export interface ILogoutEvent {
  userId: string;
  payload: { groupIds: string[] };
}

export interface ILoginEvent {
  userId: string;
  payload: { groupIds: string[] };
}
