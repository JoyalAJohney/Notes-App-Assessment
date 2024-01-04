import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, SignUpDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

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
