import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import {
  DeviceCapabilityType,
  DeviceState,
  DeviceCapabilityByType,
  DeviceType,
} from '@smart-home/shared'

export type DeviceDocument = HydratedDocument<Device>

@Schema()
export class Device {
  @Prop({ required: true })
  name: string

  @Prop({ required: true, enum: Object.keys(DeviceType) })
  type: DeviceType

  @Prop({ required: true, enum: Object.keys(DeviceState) })
  state: DeviceState

  @Prop({ required: false, default: false })
  favorite: boolean

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  capabilities: {
    [Type in DeviceCapabilityType]?: DeviceCapabilityByType<Type>
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device)
