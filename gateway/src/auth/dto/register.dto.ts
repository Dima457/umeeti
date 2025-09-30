import { IsEmail, IsString,MinLength, Matches, IsPhoneNumber } from "class-validator";
export class RegisterDto{
    @IsPhoneNumber('RU')
    phone:string;

    @IsEmail()
    email:string;

    @IsString()
    @MinLength(2)
    full_name:string;

    @IsString()
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_]+$/,{
        message: 'username can only contain latters,numbers and underscores'
    })
    username:string;

    @IsString()
    @MinLength(6)
    password:string;

    @IsString()
    password_confirm:string;
}