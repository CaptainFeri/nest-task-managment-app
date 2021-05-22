import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthPayload } from './jwt-paylod.interface';
import { AuthCredentialsDTO } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
       @InjectRepository(UserRepository)
       private userRepository : UserRepository,
       private jwtService: JwtService,
    ) {}

    singUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        return this.userRepository.signUp(authCredentialsDTO);
    }

    async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDTO);
        
        
        if (!username) {
            throw new UnauthorizedException("Invalid Authorization!");
        }

        const payload:AuthPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
