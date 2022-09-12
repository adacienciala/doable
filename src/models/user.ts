export interface IUser {
  doableId: string;
  name: string;
  email: string;
  password: string;
  surname: string;
  partyId: string;
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

export interface IUserStatisticsParty {
  xp: number;
  level: number;
}

export interface IUserStatisticsPoints {
  xp: number;
  minXp: number;
  maxXp: number;
  rank: string;
}

export interface IUserStatisticsTasks {
  current: number;
  finished: number;
  created: number;
  deleted: number;
}

export interface IUserStatistics {
  points: IUserStatisticsPoints;
  party: IUserStatisticsParty;
  tasks: IUserStatisticsTasks;
}
