import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IScore } from './schemas/Score.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Score') private readonly scoreModel: Model<IScore>,
  ) {}
  async updateScore(score: number, playerName: string) {
    const player = await this.scoreModel.findOne({ playerName });

    if (player) {
      if (player.highScore < score) {
        await this.scoreModel.updateOne({ playerName }, { highScore: score });
        const updateResult = await this.scoreModel.findOne({ playerName });
        return updateResult;
      }

      await this.scoreModel.updateOne({ playerName }, { score });
      const updateResult = await this.scoreModel.findOne({ playerName });
      return updateResult;
    }

    const newScore = new this.scoreModel({
      score,
      playerName,
      highScore: score,
    });
    const result = await newScore.save();

    return result;
  }

  async deleteAllScores() {
    const result = await this.scoreModel.deleteMany({});
    return result;
  }

  async getPlayerData(playerName: string) {
    const result = await this.scoreModel.find({ playerName });
    return result;
  }

  async getAllScores() {
    const result = await this.scoreModel.find({}).sort({ highScore: -1 });
    return result;
  }
}
