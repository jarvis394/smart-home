import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { DevicesModule } from '../devices/devices.module'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'

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
    UserModule,
    DevicesModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
      serveStaticOptions: { index: false },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
