import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { IsString, IsArray, ArrayNotEmpty, IsIn, MinLength, MaxLength, ArrayUnique } from 'class-validator';
import { PREDEFINED_ROLES, PREDEFINED_GROUPS } from '../../shared/types/roles.enum';

// in production code, this would probably be separated into test helpers

class TestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(PREDEFINED_ROLES, { each: true })
  roles: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(PREDEFINED_GROUPS, { each: true })
  groups: string[];
}

describe('ValidationPipeTest', () => {
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationPipe],
    }).compile();

    validationPipe = module.get<ValidationPipe>(ValidationPipe);
  });

  it('should be defined', () => {
    expect(validationPipe).toBeDefined();
  });

  describe('transform', () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
      data: '',
    };

    it('should pass validation with valid data', async () => {
      const validData = {
        name: 'John Doe',
        roles: ['ADMIN', 'PERSONAL'],
        groups: ['GROUP_1'],
      };

      const result = await validationPipe.transform(validData, metadata);
      expect(result).toEqual(validData);
    });

    it('should throw BadRequestException when name is too short', async () => {
      const invalidData = {
        name: 'Jo', 
        roles: ['ADMIN'],
        groups: ['GROUP_1'],
      };

      await expect(validationPipe.transform(invalidData, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when name is too long', async () => {
      const invalidData = {
        name: 'a'.repeat(101), 
        roles: ['ADMIN'],
        groups: ['GROUP_1'],
      };

      await expect(validationPipe.transform(invalidData, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when roles array is empty', async () => {
      const invalidData = {
        name: 'John Doe',
        roles: [],
        groups: ['GROUP_1'],
      };

      await expect(validationPipe.transform(invalidData, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when roles contain invalid value', async () => {
      const invalidData = {
        name: 'John Doe',
        roles: ['INVALID_ROLE'],
        groups: ['GROUP_1'],
      };

      await expect(validationPipe.transform(invalidData, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when groups array is empty', async () => {
      const invalidData = {
        name: 'John Doe',
        roles: ['ADMIN'],
        groups: [],
      };

      await expect(validationPipe.transform(invalidData, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when groups contain invalid value', async () => {
      const invalidData = {
        name: 'John Doe',
        roles: ['ADMIN'],
        groups: ['INVALID_GROUP'],
      };

      await expect(validationPipe.transform(invalidData, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with detailed error messages', async () => {
      const invalidData = {
        name: 'Jo', 
        roles: ['INVALID_ROLE'],
        groups: [],
      };

      try {
        await validationPipe.transform(invalidData, metadata);
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response.message).toBe('Validation failed');
        expect(response.errors).toBeDefined();
        expect(response.errors.length).toBeGreaterThan(0);
        
        const propertyErrors = response.errors.map(err => err.property);
        expect(propertyErrors).toContain('name');
        expect(propertyErrors).toContain('roles');
        expect(propertyErrors).toContain('groups');
      }
    });

    it('should return original value for primitive types', async () => {
      const stringMetadata: ArgumentMetadata = {
        type: 'param',
        metatype: String,
        data: 'id',
      };

      const value = 'test-id';
      const result = await validationPipe.transform(value, stringMetadata);
      expect(result).toBe(value);
    });

    it('should return original value when metatype is not provided', async () => {
      const metadataWithoutMetatype: ArgumentMetadata = {
        type: 'body',
        data: '',
      };

      const value = { test: 'value' };
      const result = await validationPipe.transform(value, metadataWithoutMetatype);
      expect(result).toBe(value);
    });

    it('should handle non-whitelisted properties correctly', async () => {
      const dataWithExtraProps = {
        name: 'John Doe',
        roles: ['ADMIN'],
        groups: ['GROUP_1'],
        extraProp: 'should be rejected',
      };

      await expect(validationPipe.transform(dataWithExtraProps, metadata)).rejects.toThrow(BadRequestException);
    });

    it('should handle duplicate values in arrays', async () => {
      const dataWithDuplicates = {
        name: 'John Doe',
        roles: ['ADMIN', 'ADMIN'],
        groups: ['GROUP_1'],
      };

      await expect(validationPipe.transform(dataWithDuplicates, metadata)).rejects.toThrow(BadRequestException);
    });
  });
});
