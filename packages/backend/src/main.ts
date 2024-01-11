import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConfigService } from './config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  await app.listen(config.PORT)
  Logger.log(
    `🚀 Application is running on: http://localhost:${config.PORT}/${globalPrefix}`
  )
}

bootstrap()
