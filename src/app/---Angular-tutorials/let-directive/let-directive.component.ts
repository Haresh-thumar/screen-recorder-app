import { Component } from '@angular/core';

@Component({
  selector: 'app-let-directive',
  imports: [],
  templateUrl: './let-directive.component.html',
  styleUrl: './let-directive.component.scss'
})
export class LetDirectiveComponent {
  user: any = {
    role: 'admin',
    hasDeletionRights: false
  }

  product: any = { price: 75000, quantity: 15, taxRate: 18 };

  cart: any[] = [
    { id: 1, name: 'Samsung Ultra S3 pro', price: 122000, quantity: 3 },
    { id: 2, name: 'Samsung Guru S5', price: 12000, quantity: 8 },
    { id: 3, name: 'Apple 16 pro max', price: 78000, quantity: 5 },
    { id: 4, name: 'Nokia Lumia XL5', price: 42000, quantity: 12 },
    { id: 5, name: 'Vivo V5 Lite', price: 24000, quantity: 6 },
    { id: 6, name: 'Motorola One Fuison Plus', price: 18700, quantity: 15 },
  ]

  salesData: Sales[] = [
    { month: 'January', amount: 120000 },
    { month: 'February', amount: 135000 },
    { month: 'March', amount: 140000 },
    { month: 'April', amount: 155000 },
    { month: 'May', amount: 165000 },
    { month: 'June', amount: 180000 }
  ];

  userses: any[] = [
    { id: 1, name: 'Raj', isActive: true, role: 'user' },
    { id: 2, name: 'Priya', isActive: true, role: 'admin' },
    { id: 3, name: 'Amit', isActive: false, role: 'user' },
    { id: 4, name: 'Neha', isActive: true, role: 'admin' }
  ];


  users: User[] = [
    {
      id: 1,
      name: 'Rajesh Sharma',
      role: 'Sales Manager',
      lastActive: new Date('2025-03-28'),
      totalSales: 320000
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Senior Executive',
      lastActive: new Date('2025-03-30'),
      totalSales: 290000
    },
    {
      id: 3,
      name: 'Amit Singh',
      role: 'Sales Executive',
      lastActive: new Date('2025-03-15'),
      totalSales: 210000
    },
    {
      id: 4,
      name: 'Neha Desai',
      role: 'Sales Executive',
      lastActive: new Date('2025-03-29'),
      totalSales: 185000
    }
  ];

}


interface Sales {
  month: string;
  amount: number;
}

interface User {
  id: number;
  name: string;
  role: string;
  lastActive: Date;
  totalSales: number;
}








