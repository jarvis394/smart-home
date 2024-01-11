import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserGetSelfRes } from '@smart-home/shared'
import { RequestWithUser } from '../auth/auth.controller'
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSelf(@Request() req: RequestWithUser): Promise<UserGetSelfRes> {
    return await this.userService.getSelf(req.user.userId)
  }
}
