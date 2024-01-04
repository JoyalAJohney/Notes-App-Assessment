import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notes {
  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  header?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ type: 'uuid' })
  createdBy: string;
}
