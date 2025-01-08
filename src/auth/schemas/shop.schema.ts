import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Shop {

    @Prop()
    scPrice: number

    @Prop()
    realPrice: number

    @Prop()
    scImage: String

}

export const ShopSchema = SchemaFactory.createForClass(Shop)