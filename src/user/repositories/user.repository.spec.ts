import { TestingModule } from '@nestjs/testing';
import { createTestingModule } from 'src/shared/test/test.module';
import { IUserRepository } from './interface';
import { IUserMockService } from 'src/user/services/mock-service/interface';
import { userMockData } from 'src/user/services/mock-service/mock-data';
import { INJECTION_TOKENS } from 'src/shared/types/injection-tokens.enum';
import { generateUlid } from 'src/common/helpers/generate-ulid';
import { RoleCode } from 'src/shared/types/roles.enum';
import { clearRepos } from 'src/shared/test/clear-repos';
import { IClearable } from 'src/shared/types/clearable.interface';

describe('UserRepositoryTest', () => {
  let userRepository: IUserRepository & IClearable;
  let userMockService: IUserMockService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createTestingModule();

    userRepository = module.get<IUserRepository & IClearable>(
      INJECTION_TOKENS.USER_REPOSITORY,
    );
    userMockService = module.get<IUserMockService>(
      INJECTION_TOKENS.USER_MOCK_SERVICE,
    );
  });

  afterEach(async () => {
    await clearRepos(module);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('findAll', () => {
    it('should return empty array when no users exist', async () => {
      const users = await userRepository.findAll();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
      const user1 = await userMockService.createOne(userMockData[0]);
      const user2 = await userMockService.createOne(userMockData[1]);

      const users = await userRepository.findAll();
      expect(users.length).toBe(2);
      expect(users[0].name).toBe(user1.name);
      expect(users[1].name).toBe(user2.name);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const createdUser = await userMockService.createOne(userMockData[0]);
      const foundUser = await userRepository.findOne(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.name).toBe(createdUser.name);
    });

    it('should return null when user does not exist', async () => {
      const nonExistentId = generateUlid();
      const user = await userRepository.findOne(nonExistentId);
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user with generated ULID', async () => {
      const userData = userMockService.getOneToCreate();
      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.id.length).toBe(26); // ULID length
      expect(user.name).toBe(userData.name);
    });

    it('should create a user with specified ID', async () => {
      const customId = generateUlid();
      const user = await userRepository.create({
        id: customId,
        ...userMockService.getOneToCreate(),
      });

      expect(user.id).toBe(customId);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const user = await userMockService.createOne(userMockData[0]);
      const updatedName = 'Updated Name';

      const updatedUser = await userRepository.update(user.id, {
        name: updatedName,
      });

      expect(updatedUser?.name).toBe(updatedName);
      expect(updatedUser?.id).toBe(user.id);
    });

    it('should return null when updating non-existent user', async () => {
      const nonExistentId = generateUlid();
      const result = await userRepository.update(nonExistentId, {
        name: 'New Name',
      });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      const user = await userMockService.createOne(userMockData[0]);
      await userRepository.delete(user.id);

      const foundUser = await userRepository.findOne(user.id);
      expect(foundUser).toBeNull();
    });

    it('should not throw when deleting non-existent user', async () => {
      const nonExistentId = generateUlid();
      await expect(userRepository.delete(nonExistentId)).resolves.not.toThrow();
    });
  });

  describe('findManagedUsers', () => {
    it('should return users in same groups excluding manager', async () => {
      const manager = await userMockService.createOne({
        ...userMockData[0],
        roles: [RoleCode.ADMIN],
        groups: ['GROUP_1', 'GROUP_2'],
      });

      const user1 = await userMockService.createOne({
        ...userMockData[1],
        groups: ['GROUP_1'],
      });

      const user2 = await userMockService.createOne({
        ...userMockData[2],
        groups: ['GROUP_2'],
      });

      await userMockService.createOne({
        groups: ['GROUP_3'],
      });

      const managedUsers = await userRepository.findManagedUsers(
        manager.id,
        manager.groups,
      );

      expect(managedUsers.length).toBe(2);
      expect(managedUsers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: user1.id }),
          expect.objectContaining({ id: user2.id }),
        ]),
      );
    });

    it('should return empty array when no matching users', async () => {
      const manager = await userMockService.createOne({
        ...userMockData[0],
        groups: ['GROUP_1'],
      });

      const managedUsers = await userRepository.findManagedUsers(
        manager.id,
        manager.groups,
      );
      expect(managedUsers).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should remove all users', async () => {
      await userMockService.createOne(userMockData[0]);
      await userMockService.createOne(userMockData[1]);

      await userRepository.clear();
      const users = await userRepository.findAll();
      expect(users).toEqual([]);
    });
  });
});
