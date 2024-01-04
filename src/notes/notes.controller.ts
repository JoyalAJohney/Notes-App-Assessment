import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Notes } from './entity/notes.entity';
import { CreateNoteDto, ShareNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAllNotes(@Request() request): Promise<Notes[]> {
    const userId = request.user.sub;
    return this.notesService.getAllNotesById(userId);
  }

  @Get('search')
  searchNotes(@Query('q') query: string, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.searchNotes(query, userId);
  }

  @Get(':id')
  getNoteById(@Param('id') id: string, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.getNoteById(id, userId);
  }

  @Post()
  createNote(@Body() input: CreateNoteDto, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.createNote(input, userId);
  }

  @Put(':id')
  updateNote(
    @Param('id') id: string,
    @Body() input: UpdateNoteDto,
    @Request() request,
  ) {
    const userId = request.user.sub;
    return this.notesService.updateNote({ id, ...input }, userId);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: string, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.deleteNote(id, userId);
  }

  @Post(':id/share')
  shareNote(@Param('id') noteId: string, @Body() input: ShareNoteDto) {
    return this.notesService.shareNoteWithUser({ ...input, noteId });
  }
}
