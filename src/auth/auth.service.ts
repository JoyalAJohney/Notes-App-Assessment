import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignUpDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async userSignUp(signUpDto: SignUpDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      signUpDto.password,
      this.SALT_ROUNDS,
    );
    const newUser = this.userRepository.create({
      username: signUpDto.username,
      password: hashedPassword,
    });
    const user = await this.userRepository.save(newUser);
    if (user) {
      delete user.password;
      return user;
    }
  }

  async userLogin(loginDto: LoginDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
