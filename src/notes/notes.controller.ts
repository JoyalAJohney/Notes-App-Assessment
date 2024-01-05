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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('notes')
@ApiBearerAuth('access-token')
@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  getAllNotes(@Request() request): Promise<Notes[]> {
    const userId = request.user.sub;
    return this.notesService.getAllNotesById(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search notes' })
  searchNotes(@Query('q') query: string, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.searchNotes(query, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by id' })
  getNoteById(@Param('id') id: string, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.getNoteById(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a note' })
  createNote(@Body() input: CreateNoteDto, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.createNote(input, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  updateNote(
    @Param('id') id: string,
    @Body() input: UpdateNoteDto,
    @Request() request,
  ) {
    const userId = request.user.sub;
    return this.notesService.updateNote({ id, ...input }, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  deleteNote(@Param('id') id: string, @Request() request) {
    const userId = request.user.sub;
    return this.notesService.deleteNote(id, userId);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a note with another user' })
  shareNote(@Param('id') noteId: string, @Body() input: ShareNoteDto) {
    return this.notesService.shareNoteWithUser({ ...input, noteId });
  }
}
