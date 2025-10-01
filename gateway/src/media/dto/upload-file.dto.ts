import { IsString, IsIn } from 'class-validator';

export class UploadFileDto {
  @IsString({ message: 'user_id должен быть строкой' })
  user_id: string;

  @IsString({ message: 'type должен быть строкой' })
  @IsIn(['avatar', 'post'], { message: 'type должен быть avatar или post' }) //!Декоратор @IsIn в NestJS
                                                                             //!Назначение: валидация значений на соответствие предопределенному списку допустимых значений.
  type: string;
}