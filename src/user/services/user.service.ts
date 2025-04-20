import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RoleCode } from 'src/shared/types/roles.enum';
import { CreateUserDto } from '../controllers/dtos/create-user.dto';
import { UpdateUserDto } from '../controllers/dtos/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from '../repositories/interface';
import { INJECTION_TOKENS } from 'src/shared/types/injection-tokens.enum';
import { IUsersService } from './interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(INJECTION_TOKENS.USER_REPOSITORY)
    private readonly repository: IUserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.repository.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);
    return this.repository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }

  async findManagedUsers(managerId: string): Promise<UserEntity[]> {
    const manager = await this.findOne(managerId);

    if (!manager.roles.includes(RoleCode.ADMIN)) {
      return [];
    }

    return this.repository.findManagedUsers(manager.id, manager.groups);
  }
}
