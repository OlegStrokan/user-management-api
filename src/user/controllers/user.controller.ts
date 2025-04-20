import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { RequiredPermissions } from 'src/common/decorators/permission.decorator';
import { PermissionsGuard } from 'src/common/guards/permission.guard';
import { Permission } from 'src/shared/types/roles.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { ApiSecurity, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { INJECTION_TOKENS } from 'src/shared/types/injection-tokens.enum';
import { IUsersService } from '../services/interface';

@ApiTags('users')
@ApiSecurity('user-id')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(INJECTION_TOKENS.USER_SERVICE)
    private readonly usersService: IUsersService,
  ) {}
  @Post()
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(Permission.CREATE)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(Permission.VIEW)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [UserDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(Permission.VIEW)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(Permission.EDIT)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Updated user', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(Permission.DELETE)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get('managed/:id')
  @UseGuards(PermissionsGuard)
  @RequiredPermissions(Permission.EDIT)
  @ApiOperation({ summary: 'Get users managed by the specified admin' })
  @ApiResponse({
    status: 200,
    description: 'List of managed users',
    type: [UserDto],
  })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  findManagedUsers(@Param('id') id: string) {
    return this.usersService.findManagedUsers(id);
  }
}
