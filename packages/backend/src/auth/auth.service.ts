import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { User, UserDocument } from '../user/schemas/user.schema'
import { ConfigService } from '../config/config.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.login(email, password)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...result } = user
    return result
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id }

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.JWT_KEY,
      }),
    }
  }

  async register(userData: Omit<User, 'devices'>) {
    const user = await this.userService.register(userData)
    const loginDetails = await this.login(user)

    return loginDetails
  }
}
