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
import {
  ApiUser,
  UserGetSelfRes,
  UserUpdateReq,
  UserUpdateRes,
  UserUploadAvatarRes,
} from '@smart-home/shared'
import { DeviceDocument } from '../devices/schemas/device.schema'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import * as path from 'path'

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserSerivce')

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private configService: ConfigService
  ) {
    this.userModel = userModel
  }

  serializeUser(userDocument: UserDocument): ApiUser {
    return {
      id: userDocument.id,
      email: userDocument.email,
      fullname: userDocument.fullname,
      avatarUrl: userDocument.avatarUrl,
    }
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

  async updateInfo(
    userId: string,
    update: UserUpdateReq
  ): Promise<UserUpdateRes> {
    const result = await this.update(userId, update)

    if (!result) {
      throw new NotFoundException('User not found')
    }

    return {
      user: this.serializeUser(result),
    }
  }

  async addDevice(device: DeviceDocument): Promise<UserDocument> {
    const result = await this.update(device.userId, {
      $push: {
        devices: device._id,
      },
    })

    if (!result) {
      throw new NotFoundException('User not found')
    }

    return result
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
      user: this.serializeUser(user),
    }
  }

  async updateAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<UserUploadAvatarRes> {
    const url = await this.saveFileToUploads(file.buffer)
    this.update(userId, { avatarUrl: url })
    return { avatarUrl: url }
  }

  private async saveFileToUploads(buffer: Buffer): Promise<string> {
    const fileName = `${uuidv4()}.webp`
    const savePath = path.join(this.configService.UPLOADS_PATH, fileName)
    const url = `/uploads/${fileName}`

    await sharp(buffer)
      .webp({
        quality: this.configService.UPLOADS_QUALITY,
      })
      .toFile(savePath)

    return url
  }
}
