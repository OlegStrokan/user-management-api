import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { PREDEFINED_GROUPS, PREDEFINED_ROLES } from 'src/shared/types/roles.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    maxLength: 100,
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    example: ['ADMIN', 'PERSONAL'],
    enum: PREDEFINED_ROLES,
    isArray: true,
    required: false,
  })
  roles?: string[];

  @ApiProperty({
    description: 'The groups the user belongs to',
    example: ['GROUP_1'],
    enum: PREDEFINED_GROUPS,
    isArray: true,
    required: false,
  })
  groups?: string[];
}
