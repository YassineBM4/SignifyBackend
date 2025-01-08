import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { ContentModule } from './content/content.module';
import { QuizzModule } from './quizz/quizz.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import *  as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'uploads', 'images'),
      serveRoot: '/uploads/images',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'quizz'),
      serveRoot: '/quizz',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<string>('DB_PORT');
        const dbName = configService.get<string>('DB_NAME');
        const user = configService.get<string>('DB_USER');
        const pass = configService.get<string>('DB_PASS');

        const credentials = user && pass ? `${user}:${pass}@` : '';
        const uri = `mongodb://${credentials}${host}:${port}/${dbName}`;

        return { uri };
      },
    }),
    AuthModule,
    CategoryModule,
    ContentModule,
    QuizzModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}