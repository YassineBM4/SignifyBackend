import { timeStamp } from "console";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
    timestamps: true
})

export class Content {
    @Prop({unique: [true]})
    contentName: String

    @Prop()
    contentImage: String

    @Prop({ type: SchemaTypes.ObjectId, ref: "Category", required: true })
    category: Types.ObjectId;
}

export const ContentSchema = SchemaFactory.createForClass(Content)