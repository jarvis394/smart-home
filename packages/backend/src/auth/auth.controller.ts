import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LocalAuthGuard } from './strategies/local.strategy'
import { UserDocument } from '../user/schemas/user.schema'

export interface RequestWithUser extends Request {
  user: UserDocument
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return req.user
  }

  @Post('register')
  async register(
    @Body() { email, fullname, password, avatarURL }: RegisterDto
  ) {
    return this.authService.register({
      email,
      fullname,
      password,
      avatarURL,
    })
  }
}
