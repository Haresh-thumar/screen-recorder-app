import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto, User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';

  // Signal for managing local state
  private usersSignal = signal<User[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Resource API implementation
  usersResource = resource({
    loader: () => this.fetchUsers()
  });

  // Public signals
  users = this.usersSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor() {
    this.loadUsers();
  }

  private fetchUsers(): Promise<User[]> {
    return this.http.get<User[]>(this.API_URL).toPromise() as Promise<User[]>;
  }

  async loadUsers(): Promise<void> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      const users = await this.fetchUsers();
      this.usersSignal.set(users);
    } catch (error) {
      this.errorSignal.set('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      const newUser = await this.http.post<User>(this.API_URL, userData).toPromise() as User;
      // Update local state
      const currentUsers = this.usersSignal();
      const updatedUsers = [...currentUsers, { ...newUser, id: currentUsers.length + 1 }];
      this.usersSignal.set(updatedUsers);
      return newUser;
    } catch (error) {
      this.errorSignal.set('Failed to create user');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      const updatedUser = await this.http.put<User>(`${this.API_URL}/${id}`, userData).toPromise() as User;
      // Update local state
      const currentUsers = this.usersSignal();
      const updatedUsers = currentUsers.map(user =>
        user.id === id ? { ...user, ...updatedUser } : user
      );
      this.usersSignal.set(updatedUsers);
      return updatedUser;
    } catch (error) {
      this.errorSignal.set('Failed to update user');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      this.loadingSignal.set(true);
      this.errorSignal.set(null);
      await this.http.delete(`${this.API_URL}/${id}`).toPromise();
      // Update local state
      const currentUsers = this.usersSignal();
      const filteredUsers = currentUsers.filter(user => user.id !== id);
      this.usersSignal.set(filteredUsers);
    } catch (error) {
      this.errorSignal.set('Failed to delete user');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // Utility method to refresh users
  async refreshUsers(): Promise<void> {
    await this.loadUsers();
  }

  initializeForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        suite: [''],
        city: ['', Validators.required],
        zipcode: ['', Validators.required]
      }),
      company: this.fb.group({
        name: ['', Validators.required]
      })
    });
  }
}