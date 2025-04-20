import { TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { INJECTION_TOKENS } from '../../shared/types/injection-tokens.enum';
import { createTestingModule } from '../../shared/test/test.module';
import { clearRepos } from '../../shared/test/clear-repos';
import { Permission, RoleCode, ROLES } from '../../shared/types/roles.enum';
import { IUserMockService } from 'src/user/services/mock-service/interface';
import { userMockData } from 'src/user/services/mock-service/mock-data';
import { PermissionsGuard } from './permission.guard';
import { PERMISSIONS_METADATA_KEY } from '../decorators/permission.decorator';
import { IUsersService } from 'src/user/services/interface';


// unlike UserServiceTest or UserRepositoryTest this test doesn't use real data. 
// real data with database is only necessary for testing services, use cases, and business logic.

describe('PermissionsGuardTest', () => {
  let userMockService: IUserMockService;
  let usersService: IUsersService;
  let module: TestingModule;

  const createMockContext = (userId?: string) => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: userId,
          },
        }),
      }),
      getHandler: jest.fn().mockReturnValue(jest.fn()),
    };
    return mockContext;
  };

  beforeAll(async () => {
    module = await createTestingModule();

    userMockService = module.get<IUserMockService>(
      INJECTION_TOKENS.USER_MOCK_SERVICE,
    );
    usersService = module.get<IUsersService>(
      INJECTION_TOKENS.USER_SERVICE,
    );
  });

  afterEach(async () => {
    await clearRepos(module);
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('canActivate', () => {
    it('should return true when no permissions are required', async () => {
      const mockReflector = { get: jest.fn().mockReturnValue(undefined) };
      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        usersService
      );
      const context = createMockContext('any-id');

      const result = await guardInstance.canActivate(
        context as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
      expect(mockReflector.get).toHaveBeenCalledWith(
        PERMISSIONS_METADATA_KEY,
        expect.any(Function)
      );
    });

    it('should throw ForbiddenException when authorization header is missing', async () => {
      const mockReflector = { get: jest.fn().mockReturnValue([Permission.CREATE]) };
      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        usersService
      );
      const context = createMockContext(undefined);

      await expect(
        guardInstance.canActivate(context as unknown as ExecutionContext),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        guardInstance.canActivate(context as unknown as ExecutionContext),
      ).rejects.toThrow('Authorization header is required');
    });

    it('should throw ForbiddenException when user has insufficient permissions', async () => {
      const mockReflector = { get: jest.fn().mockReturnValue([Permission.CREATE]) };

      const user = await userMockService.createOne({
        ...userMockData[0],
        roles: [RoleCode.VIEWER],
      });

      const context = createMockContext(user.id);

      const mockUserService = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        mockUserService as unknown as IUsersService
      );

      await expect(
        guardInstance.canActivate(context as unknown as ExecutionContext),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        guardInstance.canActivate(context as unknown as ExecutionContext),
      ).rejects.toThrow('Not allowed to perform action due to insufficient permissions');
    });

    it('should return true when user has required permissions', async () => {
      const adminPermissions = ROLES.find(r => r.code === RoleCode.ADMIN)?.permissions || [];
      const requiredPermission = adminPermissions[0]; 

      const mockReflector = { get: jest.fn().mockReturnValue([requiredPermission]) };

      const user = await userMockService.createOne({
        ...userMockData[0],
        roles: [RoleCode.ADMIN],
      });

      const context = createMockContext(user.id);

      const mockUserService = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        mockUserService as unknown as IUsersService
      );

      const result = await guardInstance.canActivate(
        context as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should handle multiple required permissions correctly', async () => {
      const requiredPermissions = [Permission.CREATE, Permission.EDIT];
      const mockReflector = { get: jest.fn().mockReturnValue(requiredPermissions) };

      const user = await userMockService.createOne({
        ...userMockData[0],
        roles: [RoleCode.ADMIN],
      });

      const context = createMockContext(user.id);

      const mockUserService = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      // type cast because of mocks
      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        mockUserService as unknown as IUsersService
      );

      const result = await guardInstance.canActivate(
        context as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should fail when user has some but not all required permissions', async () => {
      const requiredPermissions = [Permission.VIEW, Permission.CREATE];
      const mockReflector = { get: jest.fn().mockReturnValue(requiredPermissions) };

      const user = await userMockService.createOne({
        ...userMockData[0],
        roles: [RoleCode.VIEWER],
      });

      const context = createMockContext(user.id);

      const mockUserService = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        mockUserService as unknown as IUsersService
      );

      await expect(
        guardInstance.canActivate(context as unknown as ExecutionContext),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should handle user with multiple roles', async () => {
      const mockReflector = { get: jest.fn().mockReturnValue([Permission.VIEW]) };

      const user = await userMockService.createOne({
        ...userMockData[0],
        roles: [RoleCode.VIEWER, RoleCode.PERSONAL],
      });

      const context = createMockContext(user.id);

      const mockUserService = {
        findOne: jest.fn().mockResolvedValue(user)
      };

      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        mockUserService as unknown as IUsersService
      );

      const result = await guardInstance.canActivate(
        context as unknown as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const mockReflector = { get: jest.fn().mockReturnValue([Permission.VIEW]) };
      const nonExistentUserId = 'non-existent-user-id';
      const context = createMockContext(nonExistentUserId);

      const mockUserService = {
        findOne: jest.fn().mockImplementation(() => {
          throw new Error(`User with ID ${nonExistentUserId} not found`);
        })
      };

      const guardInstance = new PermissionsGuard(
        mockReflector as unknown as Reflector,
        mockUserService as unknown as IUsersService
      );

      await expect(
        guardInstance.canActivate(context as unknown as ExecutionContext),
      ).rejects.toThrow(`User with ID ${nonExistentUserId} not found`);
    });
  });

  describe('getUserPermissions', () => {
    it('should return empty array for unknown roles', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );

      const permissions = (guardInstance as any).getUserPermissions(['UNKNOWN_ROLE']);

      expect(permissions).toEqual([]);
    });

    it('should return permissions for ADMIN role', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );
      const expectedPermissions = ROLES.find(r => r.code === RoleCode.ADMIN)?.permissions || [];
 
      const permissions = (guardInstance as any).getUserPermissions([RoleCode.ADMIN]);

      expect(permissions).toEqual(expectedPermissions);
      expect(permissions).toContain(Permission.CREATE);
      expect(permissions).toContain(Permission.VIEW);
      expect(permissions).toContain(Permission.EDIT);
      expect(permissions).toContain(Permission.DELETE);
    });

    it('should return permissions for VIEWER role', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );
      const expectedPermissions = ROLES.find(r => r.code === RoleCode.VIEWER)?.permissions || [];

      const permissions = (guardInstance as any).getUserPermissions([RoleCode.VIEWER]);

      expect(permissions).toEqual(expectedPermissions);
      expect(permissions).toContain(Permission.VIEW);
      expect(permissions).not.toContain(Permission.CREATE);
      expect(permissions).not.toContain(Permission.EDIT);
      expect(permissions).not.toContain(Permission.DELETE);
    });

    it('should return empty array for PERSONAL role', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );

      const permissions = (guardInstance as any).getUserPermissions([RoleCode.PERSONAL]);

      expect(permissions).toEqual([]);
    });

    it('should combine permissions from multiple roles', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );
      const adminPermissions = ROLES.find(r => r.code === RoleCode.ADMIN)?.permissions || [];
      const viewerPermissions = ROLES.find(r => r.code === RoleCode.VIEWER)?.permissions || [];

      const permissions = (guardInstance as any).getUserPermissions([
        RoleCode.ADMIN,
        RoleCode.VIEWER,
      ]);

      expect(permissions).toEqual(expect.arrayContaining([
        ...adminPermissions,
        ...viewerPermissions,
      ]));
    });

    it('should handle duplicate permissions from multiple roles', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );


      const permissions = (guardInstance as any).getUserPermissions([
        RoleCode.ADMIN,
        RoleCode.VIEWER,
      ]);

      const viewPermissionCount = permissions.filter(
        (p: string) => p === Permission.VIEW
      ).length;

      expect(viewPermissionCount).toBe(2);
    });

    it('should filter out undefined roles', () => {
      const guardInstance = new PermissionsGuard(
        {} as Reflector,
        {} as IUsersService
      );

      const permissions = (guardInstance as any).getUserPermissions([
        RoleCode.ADMIN,
        'UNDEFINED_ROLE' as RoleCode,
      ]);

      const adminPermissions = ROLES.find(r => r.code === RoleCode.ADMIN)?.permissions || [];
      expect(permissions).toEqual(adminPermissions);
    });
  });
});
