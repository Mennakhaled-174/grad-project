import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { documentEnum } from "../common/Types/types";

export type WorkerDocument = Worker & Document;

@Schema({
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true },
})
export class Worker {

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ required: true, unique: true, trim: true })
  nationalId!: string;


  @Prop({ type: Boolean, default: true })
  isAvailable!: boolean;

  @Prop({ type: String, enum: documentEnum, default: documentEnum.VERIFIED})
  documents!: string;

 
}

export const workerSchema = SchemaFactory.createForClass(Worker);

workerSchema.virtual('bookings', {
  ref:          'Booking',
  localField:   '_id',
  foreignField: 'workerId',
});

export type HWorkerDocument = HydratedDocument<Worker>;

export const WorkerModel = MongooseModule.forFeature([
  { name: Worker.name, schema: workerSchema }
]);