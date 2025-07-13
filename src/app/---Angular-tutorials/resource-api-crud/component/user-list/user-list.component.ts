import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private userService = inject(UserService);

  // Signals for component state
  searchTerm = signal('');

  // Computed values
  users = this.userService.users;
  loading = this.userService.loading;
  error = this.userService.error;

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();

    return this.users().filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  async deleteUser(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await this.userService.deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  }

  async refreshUsers(): Promise<void> {
    try {
      await this.userService.refreshUsers();
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  }

}
