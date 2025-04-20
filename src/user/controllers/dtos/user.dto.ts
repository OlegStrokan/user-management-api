import { ApiProperty } from '@nestjs/swagger';
import { PREDEFINED_GROUPS, PREDEFINED_ROLES } from 'src/shared/types/roles.enum';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '01H1VXVXS8JNAW4VYZF3ECHM0P',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    example: ['ADMIN', 'PERSONAL'],
    enum: PREDEFINED_ROLES,
    isArray: true,
  })
  roles: string[];

  @ApiProperty({
    description: 'The groups the user belongs to',
    example: ['GROUP_1', 'GROUP_2'],
    enum: PREDEFINED_GROUPS,
    isArray: true,
  })
  groups: string[];
}
