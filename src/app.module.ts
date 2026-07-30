import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    // 1. Load the environment variables globally
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    // 2. Establish the asynchronous database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Automatically registers entities inside active feature modules
        synchronize: true,     // Turn off in production! Creates/updates database schemas automatically.
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
