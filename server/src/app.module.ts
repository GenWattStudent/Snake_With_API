import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreSchema } from './schemas/Score.schema';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Snake'),
    MongooseModule.forFeature([{ name: 'Score', schema: ScoreSchema }]),
  ],
})
export class AppModule {}
