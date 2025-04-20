import { faker } from '@faker-js/faker';
import { Injectable, Inject } from '@nestjs/common';
import { generateUlid } from 'src/common/helpers/generate-ulid';
import { INJECTION_TOKENS } from 'src/shared/types/injection-tokens.enum';
import { RoleCode } from 'src/shared/types/roles.enum';
import { CreateUserDto } from 'src/user/controllers/dtos/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { IUserRepository } from 'src/user/repositories/interface';
import { IUserMockService } from './interface';

@Injectable()
export class UserMockService implements IUserMockService {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  getOneToCreate(overrides?: Partial<CreateUserDto>): CreateUserDto {
    return {
      name: overrides?.name ?? faker.person.fullName(),
      roles: overrides?.roles ?? [RoleCode.PERSONAL],
      groups: overrides?.groups ?? ['GROUP_1'],
    };
  }

  getOne(overrides?: Partial<UserEntity>): UserEntity {
    const user = new UserEntity();
    user.id = overrides?.id ?? generateUlid();
    user.name = overrides?.name ?? faker.person.fullName();
    user.roles = overrides?.roles ?? [RoleCode.PERSONAL];
    user.groups = overrides?.groups ?? ['GROUP_1'];
    return user;
  }

  async createOne(overrides?: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.getOne(overrides);
    return await this.userRepository.create(user);
  }
}
