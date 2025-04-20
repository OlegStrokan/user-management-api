import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_METADATA_KEY } from '../decorators/permission.decorator';
import { Permission } from '../../shared/types/roles.enum';
import { ROLES } from '../../shared/types/roles.enum';
import { IUsersService } from 'src/user/services/interface';
import { INJECTION_TOKENS } from '../../shared/types/injection-tokens.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(INJECTION_TOKENS.USER_SERVICE)
    private usersService: IUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<Permission[]>(
      PERMISSIONS_METADATA_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.headers['authorization'];
    if (!userId) {
      throw new ForbiddenException('Authorization header is required');
    }

    const user = await this.usersService.findOne(userId);
    const userPermissions = this.getUserPermissions(user.roles);

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'Not allowed to perform action due to insufficient permissions',
      );
    }

    return true;
  }

  private getUserPermissions(userRoles: string[]): Permission[] {
    return userRoles
      .map((roleCode) => ROLES.find((role) => role.code === roleCode))
      .filter(Boolean)
      .flatMap((role) => role.permissions);
  }
}
