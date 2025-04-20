import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findOne(id: string): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<void>;
  findManagedUsers(managerId: string, managerGroups: string[]): Promise<UserEntity[]>;
}
