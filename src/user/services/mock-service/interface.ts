import { CreateUserDto } from 'src/user/controllers/dtos/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';

export interface IUserMockService {
  getOneToCreate(overrides?: Partial<CreateUserDto>): CreateUserDto;
  getOne(overrides?: Partial<UserEntity>): UserEntity;
  createOne(overrides?: Partial<UserEntity>): Promise<UserEntity>;
}
