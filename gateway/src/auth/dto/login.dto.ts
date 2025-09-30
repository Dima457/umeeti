import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(1, { message: 'Login is required' })
  login: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}