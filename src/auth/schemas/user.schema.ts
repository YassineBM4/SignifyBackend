import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({
    timestamps: true
})

export class User {

    @Prop()
    fullName: String

    @Prop({unique: [true, 'Duplicate email entered']})
    email: String

    @Prop()
    icon: String

    @Prop()
    password: String

    @Prop()
    gems: number

    @Prop()
    level: number

    @Prop()
    levelProgress: number

    @Prop({
      type: [
        {
          category: { type: Types.ObjectId, ref: "Category" },
          progress: { type: Number, default: 0 },
          isLocked: {type: Boolean, default: true}
        },
      ],
    })
    categoriesProgress: {
      category: Types.ObjectId;
      progress: number;
      isLocked: boolean;
    }[];
    

}

export const UserSchema = SchemaFactory.createForClass(User)