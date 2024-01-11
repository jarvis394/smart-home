import {
  Logger,
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { User, UserDocument } from './schemas/user.schema'
import { Model, UpdateQuery } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '../config/config.service'
import { UserGetSelfRes } from '@smart-home/shared'

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserSerivce')

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private configService: ConfigService
  ) {
    this.userModel = userModel
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async findById(id: string) {
    return await this.userModel.findById(id)
  }

  async update(id: string, update: UpdateQuery<User>) {
    return await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec()
  }

  async login(email: string, password: string): Promise<UserDocument> {
    const user = await this.findByEmail(email)

    if (!user) {
      throw new Error('User not found')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Invalid credentials')
    }

    return user
  }

  async register(
    user: Omit<User, 'devices' | 'refreshToken'>
  ): Promise<UserDocument> {
    const { email, password, fullname } = user
    const existingUser = await this.findByEmail(email)

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.FORBIDDEN
      )
    }

    const newUser = new this.userModel()
    newUser.email = email
    newUser.password = await this.hash(password)
    newUser.fullname = fullname
    newUser.devices = []

    const result = await this.userModel.create(newUser)
    return result
  }

  async hash(text: string): Promise<string> {
    const hashedText = await hash(text, 12)
    return hashedText
  }

  async getSelf(userId: string): Promise<UserGetSelfRes> {
    const user = await this.findById(userId)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        avatarUrl: user.avatarURL,
      },
    }
  }
}
