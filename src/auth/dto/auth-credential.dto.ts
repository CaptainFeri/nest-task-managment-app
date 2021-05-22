import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDTO {
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(
        /((?=.*\d)|(?=.*w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        ,{ message : "password is to week"}
        )
    password: string;
}