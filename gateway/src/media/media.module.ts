// media.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MediaController } from './media.controller';
import { MediaService } from './media.service'; // Импортируем сервис

@Module({
  imports: [HttpModule],
  controllers: [MediaController],
  providers: [MediaService], // Регистрируем сервис
})
export class MediaModule {}