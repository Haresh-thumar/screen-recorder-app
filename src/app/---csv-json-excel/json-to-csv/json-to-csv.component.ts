import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-to-csv',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './json-to-csv.component.html',
  styleUrl: './json-to-csv.component.scss'
})
export class JsonToCsvComponent {

  jsonInput = '';
  csvOutput = '';
  errorMessage = '';
  fileName = 'converted.csv';
  delimiter = ',';
  isLoading = false;

  convertJsonToCsv() {
    this.isLoading = true;
    this.errorMessage = '';
    this.csvOutput = '';

    try {
      if (!this.jsonInput.trim()) {
        throw new Error('Please enter JSON data');
      }

      const jsonData = JSON.parse(this.jsonInput);

      if (!Array.isArray(jsonData)) {
        throw new Error('JSON should be an array of objects');
      }

      if (jsonData.length === 0) {
        throw new Error('JSON array is empty');
      }

      // Extract headers
      const headers = Object.keys(jsonData[0]);

      // Create CSV header row
      let csv = headers.join(this.delimiter) + '\n';

      // Create CSV data rows
      jsonData.forEach((item: Record<string, any>) => {
        const row = headers.map(header => {
          // Handle nested objects and arrays
          const value = item[header];
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csv += row.join(this.delimiter) + '\n';
      });

      this.csvOutput = csv;
    } catch (error) {
      this.errorMessage = 'Error converting JSON to CSV: ' + (error as Error).message;
    } finally {
      this.isLoading = false;
    }
  }

  onFileSelected(event: Event) {
    this.isLoading = true;
    this.errorMessage = '';
    this.jsonInput = '';
    this.csvOutput = '';

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.isLoading = false;
      return;
    }

    this.fileName = file.name.replace(/\.[^/.]+$/, '') + '.csv';

    const reader = new FileReader();
    reader.onload = () => {
      this.jsonInput = reader.result as string;
      this.convertJsonToCsv();
    };
    reader.onerror = () => {
      this.errorMessage = 'Error reading file';
      this.isLoading = false;
    };
    reader.readAsText(file);
  }

  downloadCsv() {
    if (!this.csvOutput) return;

    const blob = new Blob([this.csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.csvOutput)
      .then(() => alert('CSV copied to clipboard!'))
      .catch(err => this.errorMessage = 'Failed to copy: ' + err);
  }

  clearAll() {
    this.jsonInput = '';
    this.csvOutput = '';
    this.errorMessage = '';
    this.fileName = 'converted.csv';
    const fileInput = document.getElementById('jsonFileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

}
