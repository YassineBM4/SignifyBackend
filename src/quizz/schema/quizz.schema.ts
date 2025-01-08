import { timeStamp } from "console";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
  timestamps: true,
})
export class Quizz {
  @Prop()
  quizzType: String;

  @Prop()
  quizzQuestion: String;

  @Prop()
  reponseCorrecte: String;

  @Prop()
  quizzImage1: String;

  @Prop()
  quizzImage2: String;

  @Prop()
  quizzImage3: String;

  @Prop()
  quizzImage4: String;

  @Prop({ type: SchemaTypes.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId;

}

export const QuizzSchema = SchemaFactory.createForClass(Quizz);