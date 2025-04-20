import { TestingModule } from '@nestjs/testing';
import { IUserRepository } from 'src/user/repositories/interface';
import { INJECTION_TOKENS } from '../types/injection-tokens.enum';
import { IClearable } from '../types/clearable.interface';

export const clearRepos = async (module: TestingModule) => {
  const repositories = [
    module.get<IUserRepository>(INJECTION_TOKENS.USER_REPOSITORY),
  ];

  for (const repository of repositories) {
    const retypedRepo = repository as unknown as IClearable;
    if (retypedRepo.clear) {
      await retypedRepo.clear();
    }
  }
};
