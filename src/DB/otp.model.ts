import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import { otpEnum } from '../common/Types/types';
import { emailEvents } from '../Utiles/Events/email.event';
import { Hash } from '../common/Security/hash.security';

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({ required: true, type: String })
  otp!: string;
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId!: string | Types.ObjectId;
  @Prop({ required: true, type: Date })
  expireAt!: Date;
  @Prop({ required: true, type: String, enum: otpEnum })
  otpType!: string;
  @Prop({ type: Boolean, default: false })
  isVerified!: boolean;
  @Prop({ type: Boolean, default: false })
  isUsed!: boolean;
}
export const otpSchema = SchemaFactory.createForClass(Otp);
export type HOtpDocument = HydratedDocument<Otp>;
otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre(
  'save',
  async function (this: HOtpDocument & { wasNew: boolean; plainOtp?: string }) {
    if (this.isModified('otp')) {
      this.wasNew = this.isNew;
      this.plainOtp = this.otp;
      this.otp = await Hash(this.otp);
      await this.populate('userId');
    }
  },
);

otpSchema.post('save', async function (doc, next) {
  const that = this as HOtpDocument & { wasNew?: boolean; plainOtp?: string };
  if (that.wasNew && that.plainOtp) {
    emailEvents.emit('confirmEmail', {
      to: (that.userId as any).email,
      otp: that.plainOtp,
      firstName: (that.userId as any).fullname.split(' ')[0],
    });
  }
});

export const otpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
