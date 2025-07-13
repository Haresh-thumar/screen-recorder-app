import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-csv-to-json',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './csv-to-json.component.html',
  styleUrl: './csv-to-json.component.scss'
})
export class CsvToJsonComponent {

  jsonOutput = '';
  errorMessage = '';
  hasHeader = true;
  delimiter = ',';
  fileName = '';
  isLoading = false;

  onFileSelected(event: Event) {
    this.isLoading = true;
    this.errorMessage = '';
    this.jsonOutput = '';

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.isLoading = false;
      return;
    }

    this.fileName = file.name;

    if (!file.name.endsWith('.csv')) {
      this.errorMessage = 'Please upload a CSV file';
      this.isLoading = false;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.processCSV(reader.result as string);
    reader.onerror = () => {
      this.errorMessage = 'Error reading file';
      this.isLoading = false;
    };
    reader.readAsText(file);
  }

  processCSV(csvData: string) {
    try {
      if (!csvData.trim()) {
        this.errorMessage = 'File is empty';
        this.isLoading = false;
        return;
      }

      const lines = csvData.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 1) {
        this.errorMessage = 'No data found in CSV';
        this.isLoading = false;
        return;
      }

      const headers = this.hasHeader
        ? lines[0].split(this.delimiter).map(h => h.trim())
        : Array.from({ length: lines[0].split(this.delimiter).length }, (_, i) => `column${i + 1}`);

      const startIndex = this.hasHeader ? 1 : 0;
      const result = [];

      for (let i = startIndex; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const obj: { [key: string]: string } = {};
        const currentline = lines[i].split(this.delimiter);

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j]?.trim() || '';
        }

        result.push(obj);
      }

      this.jsonOutput = JSON.stringify(result, null, 2);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = 'Error converting CSV to JSON: ' + (error as Error).message;
      this.jsonOutput = '';
    } finally {
      this.isLoading = false;
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.jsonOutput)
      .then(() => alert('JSON copied to clipboard!'))
      .catch(err => this.errorMessage = 'Failed to copy: ' + err);
  }

  downloadJson() {
    if (!this.jsonOutput) return;

    const blob = new Blob([this.jsonOutput], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName.replace('.csv', '.json') || 'converted.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearAll() {
    this.jsonOutput = '';
    this.errorMessage = '';
    this.fileName = '';
    // Clear file input
    const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

}
