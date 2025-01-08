import { timeStamp } from "console";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

@Schema({
    timestamps: true
})

export class Category {

    @Prop({unique: [true]})
    catName: String

    @Prop()
    catIcon: String

    @Prop()
    catDescription: String

    @Prop({type: Number})
    catPrice: number

    @Prop({type: Boolean})
    isLocked: boolean

    @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
    user: User;

}

export const CategorySchema = SchemaFactory.createForClass(Category)