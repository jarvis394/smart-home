import { ForbiddenException, Injectable } from '@nestjs/common'
import { AddDeviceReq, DeviceType, Device as IDevice } from '@smart-home/shared'
import { Device, DeviceDocument } from './schemas/device.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private readonly deviceModel: Model<Device>
  ) {
    this.deviceModel = deviceModel
  }

  serializeDevice(deviceDocument: DeviceDocument): IDevice {
    return {
      id: deviceDocument.id,
      userId: deviceDocument.userId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      capabilities: deviceDocument.capabilities,
      favorite: deviceDocument.favorite,
      name: deviceDocument.name,
      state: deviceDocument.state,
      type: deviceDocument.type as DeviceType,
    }
  }

  async getDevices(userId: string): Promise<IDevice[]> {
    const devices = await this.deviceModel.find({ userId })
    return devices.map((device) => this.serializeDevice(device))
  }

  async getFavoriteDevices(userId: string): Promise<IDevice[]> {
    const devices = await this.deviceModel.find({ userId, favorite: true })
    return devices.map((device) => this.serializeDevice(device))
  }

  async delete(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.deviceModel.deleteOne({ _id: deviceId, userId })

    return result.acknowledged
  }

  async toggleFavorite(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.deviceModel.findOneAndUpdate(
      { _id: deviceId, userId },
      [{ $set: { favorite: { $eq: [false, '$favorite'] } } }]
    )

    return !result?.favorite || false
  }

  async toggleOnOff(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.deviceModel.findOne({ _id: deviceId, userId })
    if (!result?.capabilities.on_off) {
      throw new ForbiddenException('Unsupported device feature')
    }

    result.capabilities.on_off.state.value =
      !result.capabilities.on_off.state.value

    await this.deviceModel.findOneAndUpdate(
      { _id: deviceId, userId },
      {
        capabilities: result.capabilities,
      },
      { new: true }
    )

    return result.capabilities.on_off.state.value
  }

  async addDevice(userId: string, data: AddDeviceReq): Promise<IDevice> {
    const newDevice = new this.deviceModel()
    newDevice.userId = userId
    newDevice.capabilities = data.capabilities
    newDevice.name = data.name
    newDevice.state = data.state
    newDevice.type = data.type

    const result = await this.deviceModel.create(newDevice)

    return this.serializeDevice(result)
  }
}
