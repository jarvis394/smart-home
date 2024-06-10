import { Module } from '@nestjs/common'
import { DevicesService } from './devices.service'
import { DevicesController } from './devices.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Device, DeviceSchema } from './schemas/device.schema'
import { ConfigService } from '../config/config.service'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { UserService } from '../user/user.service'
import { User, UserSchema } from '../user/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    DevicesService,
    ConfigService,
    UserService,
    {
      provide: 'DEVICES_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq:5672'],
            queue: 'devices_service_queue',
            queueOptions: {
              durable: false,
            },
          },
        })
      },
    },
  ],
  controllers: [DevicesController],
})
export class DevicesModule {}
