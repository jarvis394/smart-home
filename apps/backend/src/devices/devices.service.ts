import { Inject, Injectable } from '@nestjs/common'
import { AddDeviceReq, Device as IDevice } from '@smart-home/shared'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { UserService } from '../user/user.service'

@Injectable()
export class DevicesService {
  constructor(
    @Inject('DEVICES_SERVICE') private readonly client: ClientProxy,
    private userService: UserService
  ) {}

  async getDevices(userId: string): Promise<IDevice[]> {
    return await firstValueFrom(
      this.client.send({ cmd: 'getDevices' }, { userId })
    )
  }

  async getFavoriteDevices(userId: string): Promise<IDevice[]> {
    return await firstValueFrom(
      this.client.send({ cmd: 'getFavoriteDevices' }, { userId })
    )
  }

  async delete(userId: string, deviceId: string): Promise<boolean> {
    return await firstValueFrom(
      this.client.send({ cmd: 'deleteDevice' }, { userId, deviceId })
    )
  }

  async toggleFavorite(userId: string, deviceId: string): Promise<boolean> {
    return await firstValueFrom(
      this.client.send({ cmd: 'toggleFavoriteDevice' }, { userId, deviceId })
    )
  }

  async toggleOnOff(userId: string, deviceId: string): Promise<boolean> {
    return await firstValueFrom(
      this.client.send({ cmd: 'toggleOnOffDevice' }, { userId, deviceId })
    )
  }

  async addDevice(userId: string, data: AddDeviceReq): Promise<IDevice> {
    const result: IDevice = await firstValueFrom(
      this.client.send(
        { cmd: 'addDevice' },
        {
          userId,
          data,
        }
      )
    )

    await this.userService.addDevice(result)

    return result
  }
}
