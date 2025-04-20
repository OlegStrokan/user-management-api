import { TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { generateUlid } from 'src/common/helpers/generate-ulid';
import { createTestingModule } from 'src/shared/test/test.module';
import { clearRepos } from 'src/shared/test/clear-repos';
import { INJECTION_TOKENS } from 'src/shared/types/injection-tokens.enum';
import { IUsersService } from './interface';
import { IUserMockService } from './mock-service/interface';
import { userMockData } from './mock-service/mock-data';

describe('UsersServiceTest', () => {
  let module: TestingModule;
  let userService: IUsersService;
  let userMockService: IUserMockService;

  const testUsers = userMockData;
  const setupTestUsers = async () => {
    const createdUsers = [];
    for (const user of testUsers) {
      createdUsers.push(await userMockService.createOne(user));
    }
    return createdUsers;
  };

  beforeAll(async () => {
    module = await createTestingModule();
    userService = module.get<IUsersService>(INJECTION_TOKENS.USER_SERVICE);
    userMockService = module.get<IUserMockService>(INJECTION_TOKENS.USER_MOCK_SERVICE);
  });

  afterEach(async () => {
    await clearRepos(module);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('findAll()', () => {
    it('should return empty array when no users exist', async () => {
      const result = await userService.findAll();
      expect(result).toEqual([]);
    });

    it('should return all users with correct data', async () => {
      await setupTestUsers();
      const result = await userService.findAll();

      expect(result).toHaveLength(testUsers.length);
      testUsers.forEach((expectedUser) => {
        const actualUser = result.find((u) => u.id === expectedUser.id);
        expect(actualUser).toBeDefined();
        expect(actualUser).toMatchObject({
          name: expectedUser.name,
          roles: expectedUser.roles,
          groups: expectedUser.groups,
        });
      });
    });
  });

  describe('findOne()', () => {
    it('should retrieve a user by ID', async () => {
      const [testUser] = await setupTestUsers();
      const result = await userService.findOne(testUser.id);

      expect(result).toMatchObject({
        id: testUser.id,
        name: testUser.name,
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId = generateUlid();
      await expect(userService.findOne(nonExistentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    it('should create and return a new user', async () => {
      const newUserData = userMockService.getOneToCreate();
      const result = await userService.create(newUserData);

      expect(result).toMatchObject({
        name: newUserData.name,
        roles: newUserData.roles,
      });
      expect(result.id).toBeDefined();
    });
  });

  describe('update()', () => {
    it('should update user details', async () => {
      const [testUser] = await setupTestUsers();
      const updateData = { name: 'Updated Name' };

      const result = await userService.update(testUser.id, updateData);

      expect(result).toMatchObject({
        id: testUser.id,
        name: updateData.name,
      });
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      const nonExistentId = generateUlid();
      await expect(userService.update(nonExistentId, { name: 'New Name' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete()', () => {
    it('should delete an existing user', async () => {
      const [testUser] = await setupTestUsers();
      await userService.delete(testUser.id);

      await expect(userService.findOne(testUser.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when deleting non-existent user', async () => {
      const nonExistentId = generateUlid();
      await expect(userService.delete(nonExistentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findManagedUsers()', () => {
    beforeEach(async () => {
      await setupTestUsers();
    });

    it('should return empty array for non-admin manager', async () => {
      const result = await userService.findManagedUsers('3');
      expect(result).toEqual([]);
    });

    describe('when manager is admin', () => {
      it('should return users in GROUP_1 for manager 5 (Martines Polok)', async () => {
        const result = await userService.findManagedUsers('5');
        const expectedUserIds = ['1', '2', '6'];

        expect(result).toHaveLength(3);
        expect(result.map((u) => u.id)).toEqual(expect.arrayContaining(expectedUserIds));
        result.forEach((user) => {
          expect(user.groups).toContain('GROUP_1');
        });
      });

      it('should return users in GROUP_2 for manager 4 (Jarvis Khan)', async () => {
        const result = await userService.findManagedUsers('4');
        const expectedUserIds = ['1', '2', '3'];

        expect(result).toHaveLength(3);
        expect(result.map((u) => u.id)).toEqual(expect.arrayContaining(expectedUserIds));
        result.forEach((user) => {
          expect(user.groups).toContain('GROUP_2');
        });
      });
    });

    it('should throw NotFoundException for non-existent manager', async () => {
      const nonExistentId = generateUlid();
      await expect(userService.findManagedUsers(nonExistentId)).rejects.toThrow(NotFoundException);
    });
  });
});
