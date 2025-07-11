import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-web-worker-array-task',
    imports: [FormsModule],
    templateUrl: './web-worker-array-task.component.html',
    styleUrl: './web-worker-array-task.component.scss'
})
export class WebWorkerArrayTaskComponent {
  private worker: Worker | undefined;
  largeArray: User[] = [];
  displayArray: User[] = [];
  sortKey: string = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';
  isSorting: boolean = false;
  sortingTime: number | null = null;

  ngOnInit() {
    // Generate a large array of dummy data
    this.generateLargeArray(100000);
    // Show first 10 items for preview
    this.updateDisplayArray();

    // Initialize the web worker
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./array-sort.worker', import.meta.url));

      // Set up the message handler for worker responses
      this.worker.onmessage = ({ data }) => {
        const { status, result, error } = data;

        if (status === 'success') {
          // Update the array with the sorted result
          this.largeArray = result;

          // Update the display array (show only first 10 items)
          this.updateDisplayArray();

          // Calculate and display the sorting time
          this.sortingTime = performance.now() - this.startTime;

          // Reset the sorting flag
          this.isSorting = false;
        } else if (status === 'error') {
          console.error('Worker error:', error);
          this.isSorting = false;
        }
      };

      // Handle worker errors
      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        this.isSorting = false;
      };
    }
  }

  private startTime: number = 0;

  // Sort using the Web Worker
  sortWithWorker() {
    if (!this.worker) {
      alert('Web Workers are not supported in this browser');
      return;
    }

    this.isSorting = true;
    this.sortingTime = null;
    this.startTime = performance.now();

    // Send the array and sorting parameters to the worker
    this.worker.postMessage({
      array: this.largeArray,
      sortKey: this.sortKey,
      sortOrder: this.sortOrder,
    });
  }

  // Sort in the main thread (for comparison)
  sortMainThread() {
    this.isSorting = true;
    this.sortingTime = null;
    const startTime = performance.now();

    // Perform sorting on the main thread
    setTimeout(() => {
      // Create a copy to avoid modifying the original during sort
      const sortedArray = [...this.largeArray].sort((a: any, b: any) => {
        let valueA = a[this.sortKey];
        let valueB = b[this.sortKey];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) {
          return this.sortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });

      this.largeArray = sortedArray;
      this.updateDisplayArray();
      this.sortingTime = performance.now() - startTime;
      this.isSorting = false;
    }, 0);
  }

  // Generate a large array of dummy data
  private generateLargeArray(size: number) {
    const names = [
      'John',
      'Jane',
      'Alice',
      'Bob',
      'Charlie',
      'Diana',
      'Edward',
      'Fiona',
    ];
    const domains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'example.com',
      'company.com',
    ];

    this.largeArray = Array.from({ length: size }, (_, index) => {
      const nameIndex = Math.floor(Math.random() * names.length);
      const domainIndex = Math.floor(Math.random() * domains.length);
      const age = Math.floor(Math.random() * 50) + 18;

      // Generate a random date within the last 5 years
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setFullYear(today.getFullYear() - Math.floor(Math.random() * 5));
      pastDate.setMonth(Math.floor(Math.random() * 12));
      pastDate.setDate(Math.floor(Math.random() * 28) + 1);

      return {
        id: index + 1,
        name: `${names[nameIndex]} ${String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        )}`,
        email: `${names[nameIndex].toLowerCase()}${index}@${
          domains[domainIndex]
        }`,
        age: age,
        joinDate: pastDate.toISOString().split('T')[0],
      };
    });
  }

  // Update the display array (show only first 10 items)
  private updateDisplayArray() {
    this.displayArray = this.largeArray.slice(0, 50);
  }

  ngOnDestroy() {
    // Terminate the worker when the component is destroyed
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  joinDate: string;
}
