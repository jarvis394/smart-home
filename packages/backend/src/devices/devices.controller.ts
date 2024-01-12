import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { DevicesService } from './devices.service'
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy'
import { RequestWithUser } from '../auth/auth.controller'
import {
  AddDeviceReq,
  AddDeviceRes,
  DeviceDeleteRes,
  DevicesGetRes,
  FavoriteDeviceRes,
  ToggleDeviceOnOffRes,
} from '@smart-home/shared'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDevices(@Request() req: RequestWithUser): Promise<DevicesGetRes> {
    const devices = await this.devicesService.getDevices(req.user.userId)
    return { devices }
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavoriteDevices(
    @Request() req: RequestWithUser
  ): Promise<DevicesGetRes> {
    const devices = await this.devicesService.getFavoriteDevices(
      req.user.userId
    )
    return { devices }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/favorite')
  async toggleFavorite(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<FavoriteDeviceRes> {
    const state = await this.devicesService.toggleFavorite(req.user.userId, id)
    return { state }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/onOff/toggle')
  async toggleOnOff(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<ToggleDeviceOnOffRes> {
    const state = await this.devicesService.toggleOnOff(req.user.userId, id)
    return { state }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/delete')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<DeviceDeleteRes> {
    const state = await this.devicesService.delete(req.user.userId, id)
    return { ok: state }
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addDevice(
    @Request() req: RequestWithUser,
    @Body() newDevice: AddDeviceReq
  ): Promise<AddDeviceRes> {
    const device = await this.devicesService.addDevice(
      req.user.userId,
      newDevice
    )
    return { device }
  }
}
