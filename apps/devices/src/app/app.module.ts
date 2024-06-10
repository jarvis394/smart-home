import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { DevicesModule } from '../devices/devices.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.MONGO_URL,
      }),
      inject: [ConfigService],
    }),
    DevicesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
