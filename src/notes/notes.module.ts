import { Module } from '@nestjs/common';
import { Notes } from './entity/notes.entity';
import { NotesService } from './notes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { NotesController } from './notes.controller';
import { SharedNotes } from './entity/shared.note.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Notes, SharedNotes])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
