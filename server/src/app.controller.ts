import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/score')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':playerName')
  getPlayerData(@Param() params) {
    return this.appService.getPlayerData(params.playerName);
  }

  @Post()
  updateScore(@Req() request) {
    return this.appService.updateScore(
      request.body.score,
      request.body.playerName,
    );
  }

  @Delete()
  deleteScore() {
    return this.appService.deleteAllScores();
  }

  @Get()
  getAllScores() {
    return this.appService.getAllScores();
  }
}
