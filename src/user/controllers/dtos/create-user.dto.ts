import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsIn,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PREDEFINED_ROLES,
  PREDEFINED_GROUPS,
} from '../../../shared/types/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The roles assigned to the user',
    example: ['ADMIN', 'PERSONAL'],
    enum: PREDEFINED_ROLES,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(PREDEFINED_ROLES, { each: true })
  roles: string[];

  @ApiProperty({
    description: 'The groups the user belongs to',
    example: ['GROUP_1'],
    enum: PREDEFINED_GROUPS,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(PREDEFINED_GROUPS, { each: true })
  groups: string[];
}
