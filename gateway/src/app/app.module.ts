import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from '././app.service';
import { AuthModule } from 'src/auth/auth.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [AuthModule,MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
