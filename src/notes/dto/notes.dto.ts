import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  header?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  header?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

export class ShareNoteDto {
  @IsString()
  @IsOptional()
  noteId?: string;

  @IsString()
  @IsOptional()
  userId: string;
}
