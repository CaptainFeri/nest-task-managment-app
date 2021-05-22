import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDTO : AuthCredentialsDTO): Promise<void> {
        const { username , password } = authCredentialsDTO;

        const newUser = new User();
        newUser.username = username;
        newUser.salt = await bcrypt.genSalt();
        newUser.password = await this.HashPassword(password,newUser.salt);

        try {
            await newUser.save();
        } catch(e) {
            if(e.code === '23505') {
                throw new ConflictException('User name already exist!');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async HashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password,salt);
    }

    async validateUserPassword(authCredentialsDTO:AuthCredentialsDTO): Promise<string> {
        const { username , password } = authCredentialsDTO;
        const user = await this.findOne({ username });
        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }
}