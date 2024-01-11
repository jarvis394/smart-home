import { IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'Email field is invalid' })
  email: string

  @IsNotEmpty({ message: 'Password field is required' })
  password: string

  @IsNotEmpty({ message: 'Fullname field is required' })
  fullname: string

  avatarURL?: string
}
