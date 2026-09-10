import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRole } from "../../enum/UserRole";




export class RegisterDto {
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    password:string;

    @IsString()
    @IsNotEmpty()
    phone:string;

    @IsEnum(UserRole)
    role: UserRole
}