import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import * as mongoose from 'mongoose'
import { Device } from './device.schema'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true })
  fullname: string

  @Prop({ required: false })
  avatarURL?: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }] })
  devices: Device[]
}

export const UserSchema = SchemaFactory.createForClass(User)
