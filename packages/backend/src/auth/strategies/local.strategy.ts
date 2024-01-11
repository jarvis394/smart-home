import { Strategy } from 'passport-local'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { User } from '../../user/schemas/user.schema'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    })
  }

  async validate(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.authService.validateUser(email, password)
      return user
    } catch (e) {
      throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN)
    }
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
