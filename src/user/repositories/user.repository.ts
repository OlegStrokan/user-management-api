import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUserRepository } from './interface';
import { generateUlid } from '../../common/helpers/generate-ulid';
import { IClearable } from 'src/shared/types/clearable.interface';

@Injectable()
export class UserRepository implements IUserRepository, IClearable {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.repository.create({
      ...user,
      id: user.id || generateUlid(),
    });
    return this.repository.save(newUser);
  }

  async update(
    id: string,
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    await this.repository.update(id, user);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findManagedUsers(
    managerId: string,
    managerGroups: string[],
  ): Promise<UserEntity[]> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.groups && :groups', { groups: managerGroups })
      .andWhere('user.id != :managerId', { managerId })
      .getMany();
  }
  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
