export class CreateNoteDto {
  header?: string;
  content?: string;
}

export class UpdateNoteDto {
  id?: string;
  header?: string;
  content?: string;
}

export class ShareNoteDto {
  noteId?: string;
  userId: string;
}
