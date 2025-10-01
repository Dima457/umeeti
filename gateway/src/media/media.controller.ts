import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('api/media')
export class MediaController{
    constructor(private readonly mediaService:MediaService){}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))           //!@UseInterceptors — это декоратор в NestJS, который позволяет применять перехватчики (interceptors) к контроллерам или методам контроллера. Перехватчики дают возможность модифицировать запросы и ответы перед их обработкой или после.
    async uploadFile(                                   //!FileInterceptor — для загрузки файлов
        @UploadedFile() file: Express.Multer.File,      //!@UploadedFile — это декоратор, который используется вместе с FileInterceptor для получения загруженного файла в контроллере.
        @Body() uploadData:UploadFileDto,               //!Логирование (logging) — это процесс записи информации о работе приложения в специальный файл или систему для последующего анализа.
    ){                                                  //!Делегирование событий — это паттерн разработки, при котором обработчик события назначается не каждому элементу отдельно, а их общему родителю.
        try{
            if(!uploadData.user_id||!uploadData.type){
                throw new BadRequestException('user_id и type обязательны')
            }
            //* Делегируем логику сервису
            const result = await this.mediaService.uploadFile(
                file,
                uploadData.user_id,
                uploadData.type
            );
            return result;

        }catch(error){
            throw error; //! пробрасываем ошибку дальше
        }
    }
}