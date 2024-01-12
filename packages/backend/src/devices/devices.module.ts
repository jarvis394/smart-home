import { Module } from '@nestjs/common'
import { DevicesService } from './devices.service'
import { DevicesController } from './devices.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Device, DeviceSchema } from './schemas/device.schema'
import { UserService } from '../user/user.service'
import { User, UserSchema } from '../user/schemas/user.schema'
import { ConfigService } from '../config/config.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [DevicesService, ConfigService, UserService],
  controllers: [DevicesController],
})
export class DevicesModule {}
