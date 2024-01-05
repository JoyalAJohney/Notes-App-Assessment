import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      userSignUp: jest.fn(),
      userLogin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => [
            {
              ttl: configService.get<number>('THROTTLE_TTL', 60),
              limit: configService.get<number>('THROTTLE_LIMIT', 10),
            },
          ],
        }),
      ],
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should sign up a user', async () => {
    const signupDto = { username: 'testUser', password: 'testPassword' };
    const response = {
      id: '1d8b5db7a-b254-4d46-8ec8-3728b8854d64',
      username: 'testUser',
    };

    mockAuthService.userSignUp = jest.fn().mockResolvedValue(response);

    expect(await controller.signup(signupDto)).toEqual(response);
    expect(mockAuthService.userSignUp).toHaveBeenCalledWith(signupDto);
  });

  it('should log in a user', async () => {
    const loginDto = { username: 'testUser', password: 'testPassword' };
    const response = { access_token: 'someToken' };

    mockAuthService.userLogin = jest.fn().mockResolvedValue(response);

    expect(await controller.login(loginDto)).toEqual(response);
    expect(mockAuthService.userLogin).toHaveBeenCalledWith(loginDto);
  });
});
