import { SetMetadata } from '@nestjs/common';
import { Permission } from '../../shared/types/roles.enum';

export const PERMISSIONS_METADATA_KEY = 'permissions';

export const RequiredPermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_METADATA_KEY, permissions);
