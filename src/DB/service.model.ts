import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument, Types } from "mongoose";
import { cityEnum, serviceTypeEnum, sizeTypeEnum } from "../common/Types/types";
import { User } from "./user.model";
import { Booking } from "./booking.model";

@Schema({
    timestamps: true,
})

export class Service {
    
    @Prop({ required: true, enum: serviceTypeEnum, default: serviceTypeEnum.StandardCarePackage })
    service!: serviceTypeEnum;
    @Prop({ required: true, type: String , enum: sizeTypeEnum, default: sizeTypeEnum.Size80To120 })
    size!: sizeTypeEnum;
    @Prop({ required: true, type: Number })
    price!: number;
    @Prop({required:true,type: Types.ObjectId,ref:Booking.name})
    bookingId!:string | Types.ObjectId




}
export const serviceSchema = SchemaFactory.createForClass(Service)
export type HServiceDocument = HydratedDocument<Service>;
export const ServiceModel = MongooseModule.forFeature([{ name: Service.name, schema: serviceSchema }])

