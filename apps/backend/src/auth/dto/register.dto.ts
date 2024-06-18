import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail({}, { message: 'Email field is invalid' })
  email: string

  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty({ message: 'Password field is required' })
  password: string

  @ApiProperty({
    description:
      'User fullname, or any string. Will be shown as username in user modal',
  })
  @IsNotEmpty({ message: 'Fullname field is required' })
  fullname: string

  @ApiProperty({
    description: 'URL for user avatar',
  })
  @ApiPropertyOptional()
  avatarUrl?: string
}
