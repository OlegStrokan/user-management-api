import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserEntity } from 'src/user/entities/user.entity';
import { UsersModule } from 'src/user/user.module';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { INJECTION_TOKENS } from '../types/injection-tokens.enum';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UsersService } from 'src/user/services/user.service';
import { UserMockService } from 'src/user/services/mock-service/user-mock.service';

export const createTestingModule = async () => {
  return await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: `.test.env`,
        isGlobal: true,
      }),
      UsersModule,
      DatabaseModule,
      TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [
      Reflector,
      {
        provide: APP_GUARD,
        useClass: PermissionsGuard,
      },
      {
        provide: INJECTION_TOKENS.USER_REPOSITORY,
        useClass: UserRepository,
      },
      {
        provide: INJECTION_TOKENS.USER_SERVICE,
        useClass: UsersService,
      },
      {
        provide: INJECTION_TOKENS.USER_MOCK_SERVICE,
        useClass: UserMockService,
      },
    ],
  }).compile();
};
