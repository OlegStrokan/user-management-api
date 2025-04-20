import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async seed() {
    const existingUsers = await this.repository.count();
    if (existingUsers === 0) {
      const users = [
        {
          id: '1',
          name: 'John Doe',
          roles: ['ADMIN', 'PERSONAL'],
          groups: ['GROUP_1', 'GROUP_2'],
        },
        {
          id: '2',
          name: 'Grabriel Monroe',
          roles: ['PERSONAL'],
          groups: ['GROUP_1', 'GROUP_2'],
        },
        {
          id: '3',
          name: 'Alex Xavier',
          roles: ['PERSONAL'],
          groups: ['GROUP_2'],
        },
        {
          id: '4',
          name: 'Jarvis Khan',
          roles: ['ADMIN', 'PERSONAL'],
          groups: ['GROUP_2'],
        },
        {
          id: '5',
          name: 'Martines Polok',
          roles: ['ADMIN', 'PERSONAL'],
          groups: ['GROUP_1'],
        },
        {
          id: '6',
          name: 'Gabriela Wozniak',
          roles: ['VIEWER', 'PERSONAL'],
          groups: ['GROUP_1'],
        },
      ];

      await this.repository.save(users);
    }
  }
}
