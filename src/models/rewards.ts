type RewardCover = "randomA" | "randomB" | "randomC" | "randomD";

export interface IReward {
  rewardId: string;
  title: string;
  description: string;
  cover: RewardCover;
  progress: number;
  rarity: string;
  popularity: number;
}
