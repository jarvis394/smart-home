import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import {
  DeviceCapabilityType,
  DeviceCapabilityByType,
  DeviceType,
} from '@smart-home/shared'

export type DeviceDocument = HydratedDocument<Device>

@Schema()
export class Device {
  @Prop({ required: true })
  name: string

  @Prop({
    required: true,
    enum: Object.values(DeviceType),
  })
  type: `${DeviceType}`

  @Prop({ required: true })
  state: 0 | 1

  @Prop({ required: false, default: false })
  favorite: boolean

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: string

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  capabilities: {
    [Type in DeviceCapabilityType]?: DeviceCapabilityByType<Type>
  }
}

export const DeviceSchema = SchemaFactory.createForClass(Device)
