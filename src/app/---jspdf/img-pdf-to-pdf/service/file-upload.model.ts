export class FileItem {
  id: string;
  file: File;
  url: string;
  selected: boolean;
  type: 'image' | 'pdf';

  constructor(file: File) {
    this.id = crypto.randomUUID();
    this.file = file;
    this.url = URL.createObjectURL(file);
    this.selected = false;
    this.type = file.type.includes('pdf') ? 'pdf' : 'image';
  }
}
