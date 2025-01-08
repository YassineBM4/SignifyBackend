import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetCodeSchema } from './schemas/reset-code.schema';
import { MailService } from 'src/services/mail.service';
import { CategorySchema } from 'src/category/schemas/category.schema';
import { ShopSchema } from './schemas/shop.schema';

@Module({
  imports:[
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      {
       name: 'User',
       schema: UserSchema
      },
      {
        name: 'ResetCode',
        schema: ResetCodeSchema
       },
       {
        name: 'Category',
        schema: CategorySchema
       },
       {
        name: 'Shop',
        schema: ShopSchema
       }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService]
})
export class AuthModule {}
