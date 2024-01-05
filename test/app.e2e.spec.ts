import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { User } from '../src/auth/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notes } from '../src/notes/entity/notes.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let bearerToken: string;
  let userRepository: Repository<User>;
  let notesRepository: Repository<Notes>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    notesRepository = moduleFixture.get<Repository<Notes>>(
      getRepositoryToken(Notes),
    );

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'e2etestuser', password: 'testpass' });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'e2etestuser', password: 'testpass' });

    bearerToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await userRepository.delete({ username: 'e2etestuser' });
    await notesRepository.delete({ header: 'Teste2eNote' });
    await app.close();
  });

  it('/POST notes', async () => {
    const noteData = { header: 'Teste2eNote', content: 'This is a test note.' };
    await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(noteData)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.header).toBe(noteData.header);
        expect(response.body.content).toBe(noteData.content);
      });
  });

  it('/GET notes', async () => {
    return request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
      });
  });

  it('/GET notes/search', async () => {
    const keyword = 'e2e';
    await request(app.getHttpServer())
      .get(`/notes/search?q=${keyword}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        response.body.forEach((note) => {
          expect(
            note.header.includes(keyword) || note.content.includes(keyword),
          ).toBe(true);
        });
      });
  });

  it('/DELETE notes/:id', async () => {
    // Create a note and get its ID
    const noteData = {
      header: 'Note to Delete',
      content: 'Content of the note to delete.',
    };
    const createdNote = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${bearerToken}`)
      .send(noteData);

    const noteId = createdNote.body.id;

    // Test deleting the note
    await request(app.getHttpServer())
      .delete(`/notes/${noteId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(HttpStatus.OK);

    // Try to retrieve the deleted note
    await request(app.getHttpServer())
      .get(`/notes/${noteId}`)
      .set('Authorization', `Bearer ${bearerToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
