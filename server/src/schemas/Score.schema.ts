import mongoose from 'mongoose';

export const ScoreSchema = new mongoose.Schema({
  score: Number,
  highScore: Number,
  playerName: String,
});

export interface IScore {
  score: number;
  highScore: number;
  playerName: string;
}
