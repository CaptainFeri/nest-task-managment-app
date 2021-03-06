import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService
    ) {}

    @Post('/signup')
    singUp(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO) {
        return this.authService.singUp(authCredentialsDTO);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDTO);
    }

}
