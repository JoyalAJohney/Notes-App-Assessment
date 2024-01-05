import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  header?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  content?: string;
}

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  header?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  content?: string;
}

export class ShareNoteDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  noteId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  userId: string;
}
