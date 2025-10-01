import { Injectable, BadRequestException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom} from "rxjs/internal/firstValueFrom";


@Injectable()
export class MediaService{
    constructor(private readonly httpService:HttpService){}
    private readonly Media_Service_Url = 'http://localhost:8083/upload';

    //* Основной метод для загрузки файла в Go media-service
    async uploadFile(
        file:Express.Multer.File, //* хранит в себе инфу о загруженном файле
        userId:string,
        type:string
    ):Promise<any>{
        //* Проверяем что файл есть
        if(!file){
            throw new BadRequestException('file is not load');//!BadRequestException() -ошибка когда введенные данные не те которые мы ожидаем или неправильные
        }
        //* Проверяем тип файла на стороне Gateway (дополнительная защита)
        if(!this.isValidFileType(file.mimetype, type)){
            throw new BadRequestException(
                `type of file ${file.mimetype} is not true for ${type}`,
            )
        };
        try{
             // *Создаем FormData для отправки в Go media-service
            const formData = new FormData();                                      //!FormData — это специальный интерфейс в JavaScript, который позволяет работать с данными HTML-форм. Он предоставляет удобный способ сбора и отправки данных на сервер, включая файлы, текстовые поля и другие элементы формы.
            //* Добавляем файл как Blob                                            Blob (Binary Large Object) — это специальный объект в JavaScript, предназначенный для работы с бинарными данными. Он позволяет хранить и управлять различными типами контента, включая файлы, изображения и другие медиа-данные.
            formData.append('file', new Blob([file.buffer.buffer] as ArrayBuffer[]), file.originalname); //!file.originalname — это свойство объекта файла, которое содержит оригинальное имя файла, как оно было на компьютере пользователя до загрузки на сервер.
            formData.append('userid',userId);                                    //!file.buffer — это свойство объекта файла, которое содержит бинарные данные загруженного файла в виде буфера. Buffer — это специальный тип данных в Node.js для работы с бинарными данными.
            formData.append('type',type);
            //* Отправляем запрос в Go media-service
            const response = await firstValueFrom(
                this.httpService.post(`${this.Media_Service_Url}`, formData,{
                    headers:{
                        'Content-Type': 'miltipart/formdata'
                    }
                }),
            )
             return response.data
             // *Обрабатываем ошибки от Go media-service
    }catch(error){
        if(error.response){
            error.response.data||'error of load is file'
        };
        throw new BadRequestException('media service is not dostypen');
        }
    }
    private isValidFileType(mimetype:string, uploadType:string):boolean{
         const allowedImageTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp'
        ];

        if(mimetype === 'avatar'|| uploadType==='post'){
            return allowedImageTypes.includes(mimetype);
        }
        return false
    }
    //* Метод для получения информации о файле 
    async getFileInfo(filename:string):Promise<any>{
        try{
            const mediaServisUrl = `${this.Media_Service_Url}/media/${filename}`;
            const response = await firstValueFrom(
                this.httpService.get(mediaServisUrl)
            );
            return response.data;
        }catch(error){
            if(error){
                throw new BadRequestException(error.response.data);
            }
                throw new BadRequestException('media service не доступен')
        }
        
    }
}