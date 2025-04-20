import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../controllers/dtos/create-user.dto';
import { UpdateUserDto } from '../controllers/dtos/update-user.dto';

export interface IUsersService {
  findAll(): Promise<UserEntity[]>;
  findOne(id: string): Promise<UserEntity>;
  create(createUserDto: CreateUserDto): Promise<UserEntity>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  findManagedUsers(managerId: string): Promise<UserEntity[]>;
}
