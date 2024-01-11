import { Logger, Injectable } from '@nestjs/common'
import { compare, genSalt, hash } from 'bcryptjs'
import { User, UserDocument } from './schemas/user.schema'
import { Model, FilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserSerivce')

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    this.userModel = userModel
  }

  async findOne(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User> | null,
    options?: QueryOptions<User> | null
  ) {
    return await this.userModel.findOne(filter, projection, options)
  }

  async login(email: string, password: string): Promise<UserDocument> {
    const user = await this.findOne({ email })

    if (!user) {
      throw new Error('User not found')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new Error('Invalid credentials')
    }

    return user
  }

  async register(user: Omit<User, 'devices'>): Promise<UserDocument> {
    const { email, password, fullname } = user

    const newUser = new this.userModel()
    newUser.email = email
    newUser.password = await this.hashPassword(password)
    newUser.fullname = fullname
    newUser.devices = []

    const result = await this.userModel.create(newUser)
    return result
  }

  protected async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(12)
    const hashedPassword = await hash(password, salt)

    return hashedPassword
  }
}
