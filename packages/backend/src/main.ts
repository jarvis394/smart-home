import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { PORT } from './config/constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  await app.listen(PORT)
  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}`
  )
}

bootstrap()
