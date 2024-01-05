import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from '../../src/notes/notes.controller';
import { NotesService } from '../../src/notes/notes.service';

describe('NotesController', () => {
  let controller: NotesController;
  let mockNotesService: Partial<NotesService>;

  beforeEach(async () => {
    mockNotesService = {
      getAllNotesById: jest.fn(),
      searchNotes: jest.fn(),
      getNoteById: jest.fn(),
      createNote: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
      shareNoteWithUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [{ provide: NotesService, useValue: mockNotesService }],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should return all notes for a user', async () => {
    const userId = 'user1';
    const mockNotes = [{ id: 'note1', createdBy: userId }];
    mockNotesService.getAllNotesById = jest.fn().mockResolvedValue(mockNotes);

    const result = await controller.getAllNotes({ user: { sub: userId } });
    expect(result).toEqual(mockNotes);
    expect(mockNotesService.getAllNotesById).toHaveBeenCalledWith(userId);
  });

  it('should search notes by query', async () => {
    const userId = 'user1';
    const query = 'test';
    const mockNotes = [{ id: 'note1', header: 'Test Note', createdBy: userId }];
    mockNotesService.searchNotes = jest.fn().mockResolvedValue(mockNotes);

    const result = await controller.searchNotes(query, {
      user: { sub: userId },
    });
    expect(result).toEqual(mockNotes);
    expect(mockNotesService.searchNotes).toHaveBeenCalledWith(query, userId);
  });

  it('should return a specific note by id', async () => {
    const userId = 'user1';
    const noteId = 'note1';
    const mockNote = { id: noteId, createdBy: userId };
    mockNotesService.getNoteById = jest.fn().mockResolvedValue(mockNote);

    const result = await controller.getNoteById(noteId, {
      user: { sub: userId },
    });
    expect(result).toEqual(mockNote);
    expect(mockNotesService.getNoteById).toHaveBeenCalledWith(noteId, userId);
  });

  it('should create a new note', async () => {
    const userId = 'user1';
    const createNoteDto = { header: 'New Note', content: 'Content' };
    const newNote = { ...createNoteDto, id: 'note2', createdBy: userId };
    mockNotesService.createNote = jest.fn().mockResolvedValue(newNote);

    const result = await controller.createNote(createNoteDto, {
      user: { sub: userId },
    });
    expect(result).toEqual(newNote);
    expect(mockNotesService.createNote).toHaveBeenCalledWith(
      createNoteDto,
      userId,
    );
  });

  it('should update an existing note', async () => {
    const userId = 'user1';
    const noteId = 'note1';
    const updateNoteDto = {
      header: 'Updated Note',
      content: 'Updated Content',
    };
    const updatedNote = { ...updateNoteDto, id: noteId, createdBy: userId };
    mockNotesService.updateNote = jest.fn().mockResolvedValue(updatedNote);

    const result = await controller.updateNote(noteId, updateNoteDto, {
      user: { sub: userId },
    });
    expect(result).toEqual(updatedNote);
    expect(mockNotesService.updateNote).toHaveBeenCalledWith(
      { id: noteId, ...updateNoteDto },
      userId,
    );
  });

  it('should delete a note', async () => {
    const userId = 'user1';
    const noteId = 'note1';
    mockNotesService.deleteNote = jest.fn().mockResolvedValue(true);

    const result = await controller.deleteNote(noteId, {
      user: { sub: userId },
    });
    expect(result).toBe(true);
    expect(mockNotesService.deleteNote).toHaveBeenCalledWith(noteId, userId);
  });

  it('should share a note with another user', async () => {
    const noteId = 'note1';
    const shareNoteDto = { userId: 'user2' };
    const sharedNote = { noteId: noteId, ...shareNoteDto };
    mockNotesService.shareNoteWithUser = jest
      .fn()
      .mockResolvedValue(sharedNote);

    const result = await controller.shareNote(noteId, shareNoteDto);
    expect(result).toEqual(sharedNote);
    expect(mockNotesService.shareNoteWithUser).toHaveBeenCalledWith({
      noteId,
      ...shareNoteDto,
    });
  });
});
