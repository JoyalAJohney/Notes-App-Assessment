import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotesService } from '../../src/notes/notes.service';
import { SharedNotes } from '../../src/notes/entity/shared.note.entity';
import { Notes } from '../../src/notes/entity/notes.entity';
import { AuthService } from '../../src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('NotesService', () => {
  let service: NotesService;
  let mockNotesRepository: Partial<Repository<Notes>>;
  let mockSharedNotesRepository: Partial<Repository<SharedNotes>>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockNotesRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockSharedNotesRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };
    mockAuthService = {
      getUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Notes),
          useValue: mockNotesRepository,
        },
        {
          provide: getRepositoryToken(SharedNotes),
          useValue: mockSharedNotesRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should return all notes created by a specific user', async () => {
    const userId = 'd8b5db7a-b254-4d46-8ec8-3728b8854d64';
    const mockNotes = [
      { id: '1290bcad-f3d7-400b-9c3b-0456867698d5', createdBy: userId },
    ];
    mockNotesRepository.find = jest.fn().mockResolvedValue(mockNotes);

    const result = await service.getAllNotesById(userId);
    expect(result).toEqual(mockNotes);
    expect(mockNotesRepository.find).toHaveBeenCalledWith({
      where: { createdBy: userId },
    });
  });

  it('should create a new note', async () => {
    const createNoteDto = { header: 'Test Note', content: 'Content' };
    const userId = 'd8b5db7a-b254-4d46-8ec8-3728b8854d64';
    const savedNote = {
      ...createNoteDto,
      id: '1290bcad-f3d7-400b-9c3b-0456867698d5',
      createdBy: userId,
    };
    mockNotesRepository.create = jest.fn().mockReturnValue(savedNote);
    mockNotesRepository.save = jest.fn().mockResolvedValue(savedNote);

    const result = await service.createNote(createNoteDto, userId);
    expect(result).toEqual(savedNote);
    expect(mockNotesRepository.create).toHaveBeenCalledWith({
      ...createNoteDto,
      createdBy: userId,
    });
  });

  it('should update a note', async () => {
    const updateNoteDto = {
      id: '1290bcad-f3d7-400b-9c3b-0456867698d5',
      header: 'Updated Note',
      content: 'Updated Content',
    };
    const userId = 'd8b5db7a-b254-4d46-8ec8-3728b8854d64';
    mockNotesRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
    mockNotesRepository.findOne = jest
      .fn()
      .mockResolvedValue({ ...updateNoteDto, createdBy: userId });

    const result = await service.updateNote(updateNoteDto, userId);
    expect(result).toEqual({ ...updateNoteDto, createdBy: userId });
    expect(mockNotesRepository.update).toHaveBeenCalledWith(
      { id: updateNoteDto.id, createdBy: userId },
      updateNoteDto,
    );
  });

  it('should delete a note', async () => {
    const noteId = '1290bcad-f3d7-400b-9c3b-0456867698d5';
    const userId = 'd8b5db7a-b254-4d46-8ec8-3728b8854d64';
    const mockNote = { id: noteId, createdBy: userId };
    mockNotesRepository.findOne = jest.fn().mockResolvedValue(mockNote);
    mockNotesRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

    const result = await service.deleteNote(noteId, userId);
    expect(result).toBe(true);
    expect(mockNotesRepository.delete).toHaveBeenCalledWith({
      id: noteId,
      createdBy: userId,
    });
  });

  it('should throw NotFoundException if note is not found', async () => {
    const noteId = '1290bcad-f3d7-400b-9c3b-0456867698d5';
    const userId = 'd8b5db7a-b254-4d46-8ec8-3728b8854d64';
    mockNotesRepository.findOne = jest.fn().mockResolvedValue(undefined);

    await expect(service.deleteNote(noteId, userId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should share a note with another user', async () => {
    const shareNoteDto = {
      noteId: '1290bcad-f3d7-400b-9c3b-0456867698d5',
      userId: 'dfc57ec5-0d88-426b-97dc-5193f272b07d',
    };
    const sharedNote = { ...shareNoteDto, id: 'shared1' };
    mockSharedNotesRepository.create = jest.fn().mockReturnValue(sharedNote);
    mockSharedNotesRepository.save = jest.fn().mockResolvedValue(sharedNote);

    const result = await service.shareNoteWithUser(shareNoteDto);
    expect(result).toEqual(sharedNote);
    expect(mockSharedNotesRepository.create).toHaveBeenCalledWith(shareNoteDto);
  });

  it('should search for notes by keyword', async () => {
    const userId = 'dfc57ec5-0d88-426b-97dc-5193f272b07d';
    const keyword = 'test';
    const mockNotes = [
      {
        id: '1290bcad-f3d7-400b-9c3b-0456867698d5',
        header: 'Test Note',
        content: 'Content',
        createdBy: userId,
      },
    ];

    const mockQueryBuilder: Partial<SelectQueryBuilder<Notes>> = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockNotes),
    };

    mockNotesRepository.createQueryBuilder = jest.fn(
      () => mockQueryBuilder as SelectQueryBuilder<Notes>,
    );

    const result = await service.searchNotes(keyword, userId);
    expect(result).toEqual(mockNotes);
    expect(mockQueryBuilder.where).toHaveBeenCalled();
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
  });
});
