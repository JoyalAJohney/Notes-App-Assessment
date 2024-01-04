import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    NotesModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
