export enum RoleCode {
  ADMIN = 'ADMIN',
  PERSONAL = 'PERSONAL',
  VIEWER = 'VIEWER',
}

export enum Permission {
  CREATE = 'CREATE',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

export interface Role {
  name: string;
  code: RoleCode;
  permissions: Permission[];
}

export const ROLES: Role[] = [
  {
    name: 'Admin',
    code: RoleCode.ADMIN,
    permissions: [Permission.CREATE, Permission.VIEW, Permission.EDIT, Permission.DELETE],
  },
  { name: 'Personal', code: RoleCode.PERSONAL, permissions: [] },
  { name: 'Viewer', code: RoleCode.VIEWER, permissions: [Permission.VIEW] },
];

export const PREDEFINED_ROLES = ROLES.map((role) => role.code);
export const PREDEFINED_GROUPS = ['GROUP_1', 'GROUP_2'];
