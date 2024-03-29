import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Notes } from './entity/notes.entity';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { SharedNotes } from './entity/shared.note.entity';
import { CreateNoteDto, ShareNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Notes)
    private notesRepository: Repository<Notes>,
    @InjectRepository(SharedNotes)
    private sharedNotesRepository: Repository<SharedNotes>,
    private authService: AuthService,
  ) {}

  getAllNotesById(userId: string): Promise<Notes[]> {
    return this.notesRepository.find({
      where: {
        createdBy: userId,
      },
    });
  }

  async getNoteById(id: string, userId: string): Promise<Notes> {
    const note = await this.notesRepository.findOne({
      where: {
        id,
        createdBy: userId,
      },
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }

  async createNote(input: CreateNoteDto, userId: string) {
    await this.authService.getUserById(userId);
    const newNote = this.notesRepository.create({
      ...input,
      createdBy: userId,
    });
    return this.notesRepository.save(newNote);
  }

  async updateNote(input: UpdateNoteDto, userId?: string) {
    await this.authService.getUserById(userId);
    await this.notesRepository.update(
      { id: input.id, createdBy: userId },
      input,
    );
    return this.notesRepository.findOne({ where: { id: input.id } });
  }

  async deleteNote(id: string, userId?: string) {
    const note = await this.getNoteById(id, userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    await this.notesRepository.delete({ id, createdBy: userId });
    return true;
  }

  async shareNoteWithUser(input: ShareNoteDto) {
    await this.authService.getUserById(input.userId);
    const sharedNote = this.sharedNotesRepository.create(input);
    return this.sharedNotesRepository.save(sharedNote);
  }

  async searchNotes(keyword: string, userId: string): Promise<Notes[]> {
    const searchQuery = this.buildSearchQuery(keyword);
    return this.notesRepository
      .createQueryBuilder('notes')
      .where('notes.createdBy = :userId', { userId })
      .andWhere(`notes."searchTerm" @@ ${searchQuery}`)
      .addOrderBy(`ts_rank_cd(notes."searchTerm", ${searchQuery})`, 'DESC')
      .getMany();
  }

  buildSearchQuery(searchKey: string): string {
    return `to_tsquery('simple', '${this.buildSearchTokens(searchKey)}')`;
  }

  buildSearchTokens(searchKey: string): string {
    const words = searchKey.trim().split(/\s+/);
    return words.join(' & ') + ':*';
  }
}
