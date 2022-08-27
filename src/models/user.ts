export interface IUser {
  doableId: string;
  name: string;
  email: string;
  password: string;
  surname: string;
  sessions: IUserSession[];
  settings: IUserSettings;
  statistics: IUserStatistics;
}

export interface IUserSession {
  token: string;
  tokenSelector: string;
  tokenTimestamp: number;
}

export interface IUserSettings {
  avatarSeed: string;
}

export interface IUserStatistics {
  xp: number;
  minXp: number;
  maxXp: number;
  rank: string;
}
