import { CurrencyPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-for-loop-if-else',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './for-loop-if-else.component.html',
  styleUrl: './for-loop-if-else.component.scss',
})
export class ForLoopIfElseComponent {
  // Sample data
  users = [
    {
      id: 1,
      name: 'Rajesh Patel',
      email: 'johndoe759@gmail.com',
      title: 'vjdv',
      date: '23-Feb-2025',
    },
    {
      id: 2,
      name: 'Priya Shah',
      email: 'johndoe759@gmail.com',
      title: 'vjdv',
      date: '23-Jan-2025',
    },
    {
      id: 3,
      name: 'Amit Verma',
      email: 'johndoe759@gmail.com',
      title: 'vjdv',
      date: '23-Mar-2025',
    },
  ];

  products = [
    { id: 101, name: 'Smartphone', price: 15000 },
    { id: 102, name: 'Laptop', price: 45000 },
    { id: 103, name: 'Headphones', price: 2500 },
  ];

  tasks = [
    { id: 1, title: 'Complete project', status: 'In Progress' },
    { id: 2, title: 'Meeting with client', status: 'Scheduled' },
    { id: 3, title: 'Update documentation', status: 'Pending' },
    { id: 4, title: 'Code review', status: 'Completed' },
  ];

  isLoggedIn: boolean = true;
  isAdmin: boolean = true;
  isPremiumUser: boolean = true;
  status: string = 'success';
}
