import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiPropertyOptional()
  readonly username?: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;

  @ApiPropertyOptional()
  readonly about?: string;
}
