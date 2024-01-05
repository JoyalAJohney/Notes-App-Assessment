import { Repository } from 'typeorm';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/auth/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepositoryMock: Partial<Repository<User>>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    userRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    jwtServiceMock = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return a user by id', async () => {
    const mockUser = {
      id: 'd8b5db7a-b254-4d46-8ec8-3728b8854d64',
      username: 'user',
      password: 'pass',
    };
    userRepositoryMock.findOne = jest.fn().mockResolvedValue(mockUser);

    const result = await service.getUserById(
      'd8b5db7a-b254-4d46-8ec8-3728b8854d64',
    );
    expect(result).toEqual(mockUser);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 'd8b5db7a-b254-4d46-8ec8-3728b8854d64' },
    });
  });

  it('should throw NotFoundException for an invalid id', async () => {
    userRepositoryMock.findOne = jest.fn().mockResolvedValue(undefined);

    await expect(service.getUserById('123')).rejects.toThrow(NotFoundException);
  });

  // User Sign Up
  it('should create a new user', async () => {
    const signUpDto = { username: 'newUser', password: 'password123' };
    const savedUser = { ...signUpDto, id: '1', password: 'hashedPassword' };
    userRepositoryMock.create = jest.fn().mockReturnValue(savedUser);
    userRepositoryMock.save = jest.fn().mockResolvedValue(savedUser);
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    const result = await service.userSignUp(signUpDto);
    expect(result).toEqual({ ...savedUser, password: undefined });
    expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
  });

  // User Login
  it('should return access token on valid login', async () => {
    const user = {
      id: 'd8b5db7a-b254-4d46-8ec8-3728b8854d64',
      username: 'user',
      password: 'hashedPassword',
    };
    const loginDto = { username: 'user', password: 'password123' };
    userRepositoryMock.findOne = jest.fn().mockResolvedValue(user);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwtServiceMock.sign = jest.fn().mockReturnValue('signedToken');

    const result = await service.userLogin(loginDto);
    expect(result).toEqual({ access_token: 'signedToken' });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    const loginDto = { username: 'user', password: 'wrongPassword' };
    userRepositoryMock.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.userLogin(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
