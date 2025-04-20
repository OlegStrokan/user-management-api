import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersSeeder } from './user.seeder';
import { UsersController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/user.service';
import { INJECTION_TOKENS } from 'src/shared/types/injection-tokens.enum';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,

    {
      provide: INJECTION_TOKENS.USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: INJECTION_TOKENS.USER_SERVICE,
      useClass: UsersService,
    },
    UsersSeeder,
  ],
  exports: [
    {
      provide: INJECTION_TOKENS.USER_SERVICE,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {
  constructor(private readonly usersSeeder: UsersSeeder) {}

  async onModuleInit() {
    await this.usersSeeder.seed();
  }
}
