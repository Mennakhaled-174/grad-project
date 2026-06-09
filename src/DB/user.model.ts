import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Hash } from '../common/Security/hash.security';

import { userRole } from '../common/Types/types';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, type: String, trim: true, lowercase: true })
  fullname!: string;
  @Prop({
    required: true,
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email!: string;
  @Prop({ required: true, type: String })
  password!: string;
  @Prop({ required: true, type: String, unique: true })
  nationalId!: string;
  @Prop({ type: String, enum: userRole, default: userRole.USER})
  role!: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy!: mongoose.Types.ObjectId;
  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;
  @Prop()
  changeCredentialTime!: Date;
  @Prop({ type: String, default: null })
resetToken!: string | null;

@Prop({ type: Date, default: null })
resetTokenExpire!: Date | null;
}
export const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('otp', {
  localField: '_id',
  ref: 'otp',
  foreignField: 'userId',
});

userSchema.virtual('booking', {
  localField: '_id',
  ref: 'booking',
  foreignField: 'userId',
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = Hash(this.password);
  }
});

export type HUserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
