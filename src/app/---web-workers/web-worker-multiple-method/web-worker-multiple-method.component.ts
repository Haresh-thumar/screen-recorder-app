import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-web-worker-multiple-method',
    imports: [FormsModule, CurrencyPipe],
    templateUrl: './web-worker-multiple-method.component.html',
    styleUrl: './web-worker-multiple-method.component.scss'
})
export class WebWorkerMultipleMethodComponent {
  private worker: Worker | undefined;
  private originalArray: User[] = [];
  dataArray: User[] = [];
  displayArray: any[] = [];
  isProcessing = false;
  processingTime: number | null = null;
  showBonus = false;
  isAggregateView = false;

  // Task counter for tracking multiple concurrent operations
  private taskIdCounter = 0;
  private taskCallbacks = new Map<
    number,
    { resolve: Function; reject: Function }
  >();

  // Operation configurations
  sortOperation = {
    sortKey: 'id',
    sortOrder: 'asc',
  };

  filterOperation = {
    ageMin: null as number | null,
    ageMax: null as number | null,
    status: '',
  };

  searchOperation = {
    term: '',
    fields: ['name', 'email', 'department'],
  };

  ngOnInit() {
    // Generate sample data
    this.generateData(10000);
    this.dataArray = [...this.originalArray];
    this.updateDisplayArray();

    // Initialize worker
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('./multi-operation.worker', import.meta.url)
      );

      this.worker.onmessage = ({ data }) => {
        const { status, operation, result, taskId, error } = data;

        if (this.taskCallbacks.has(taskId)) {
          const { resolve, reject } = this.taskCallbacks.get(taskId)!;

          if (status === 'success') {
            resolve({ operation, result });
          } else {
            reject(error);
          }

          this.taskCallbacks.delete(taskId);
        }
      };

      this.worker.onerror = (error) => {
        console.error('Worker error:', error);
        this.isProcessing = false;
      };
    } else {
      console.error('Web Workers are not supported in this browser');
    }
  }

  // Execute a worker operation and return a promise
  executeWorkerTask(operation: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject('Web Worker not available');
        return;
      }

      const taskId = this.taskIdCounter++;
      this.taskCallbacks.set(taskId, { resolve, reject });

      this.worker.postMessage({
        operation,
        payload,
        taskId,
      });
    });
  }

  // Generic method to execute operations
  async executeOperation(operation: string, payload: any) {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.isAggregateView = false;
    this.processingTime = null;
    const startTime = performance.now();

    try {
      const response = await this.executeWorkerTask(operation, payload);
      this.dataArray = response.result;
      this.updateDisplayArray();
      this.processingTime = Math.round(performance.now() - startTime);
    } catch (error) {
      console.error(`Error during ${operation} operation:`, error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Execute filter operation (converts UI inputs to filter criteria)
  async executeFilter() {
    const criteria: any = {};

    if (
      this.filterOperation.ageMin !== null ||
      this.filterOperation.ageMax !== null
    ) {
      criteria.age = {};
      if (this.filterOperation.ageMin !== null)
        criteria.age.min = this.filterOperation.ageMin;
      if (this.filterOperation.ageMax !== null)
        criteria.age.max = this.filterOperation.ageMax;
    }

    if (this.filterOperation.status) {
      criteria.status = this.filterOperation.status;
    }

    await this.executeOperation('filter', { array: this.dataArray, criteria });
  }

  // Execute aggregation operation
  async executeAggregation() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.processingTime = null;
    const startTime = performance.now();

    try {
      const groupBy = {
        field: 'department',
        aggregations: [
          { field: 'salary', type: 'sum' },
          { field: 'salary', type: 'avg' },
          { field: 'age', type: 'min' },
          { field: 'age', type: 'max' },
          { field: 'age', type: 'count' },
        ],
      };

      const response = await this.executeWorkerTask('aggregate', {
        array: this.dataArray,
        groupBy,
      });
      this.dataArray = response.result;
      this.isAggregateView = true;
      this.updateDisplayArray(true); // Show all aggregate results
      this.processingTime = Math.round(performance.now() - startTime);
    } catch (error) {
      console.error('Error during aggregation:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Calculate employee bonuses based on salary and department
  async executeCustomTransformation() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.showBonus = true;
    this.processingTime = null;
    const startTime = performance.now();

    try {
      // Define transformations
      const transformation = {
        bonus:
          'item.salary * (item.department === "Engineering" ? 0.15 : item.department === "Sales" ? 0.12 : 0.1)',
      };

      const response = await this.executeWorkerTask('map', {
        array: this.dataArray,
        transformation,
      });
      this.dataArray = response.result;
      this.updateDisplayArray();
      this.processingTime = Math.round(performance.now() - startTime);
    } catch (error) {
      console.error('Error during transformation:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Reset to original data
  resetData() {
    this.dataArray = [...this.originalArray];
    this.showBonus = false;
    this.isAggregateView = false;
    this.updateDisplayArray();
    this.processingTime = null;
  }

  // Update the display array (showing a subset of results)
  updateDisplayArray(showAll = false) {
    this.displayArray = showAll ? this.dataArray : this.dataArray.slice(0, 20);
  }

  // Generate sample data
  private generateData(count: number) {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const statuses = ['active', 'inactive', 'pending'];
    const firstNames = [
      'John',
      'Jane',
      'Alex',
      'Sarah',
      'Michael',
      'Emma',
      'David',
      'Olivia',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Miller',
      'Davis',
      'Wilson',
    ];

    this.originalArray = Array.from({ length: count }, (_, index) => {
      const deptIndex = Math.floor(Math.random() * departments.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const fnIndex = Math.floor(Math.random() * firstNames.length);
      const lnIndex = Math.floor(Math.random() * lastNames.length);

      return {
        id: index + 1,
        name: `${firstNames[fnIndex]} ${lastNames[lnIndex]}`,
        email: `${firstNames[fnIndex].toLowerCase()}.${lastNames[
          lnIndex
        ].toLowerCase()}@example.com`,
        age: Math.floor(Math.random() * 40) + 20, // 20-60
        status: statuses[statusIndex],
        salary: Math.floor(Math.random() * 80000) + 40000, // 40k-120k
        department: departments[deptIndex],
      };
    });
  }

  ngOnDestroy() {
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
  status: string;
  salary: number;
  department: string;
}
