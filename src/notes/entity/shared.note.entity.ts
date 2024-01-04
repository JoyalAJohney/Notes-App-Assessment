import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['noteId', 'userId'])
export class SharedNotes {
  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  noteId: string;

  @Column({ type: 'uuid' })
  userId: string;
}
