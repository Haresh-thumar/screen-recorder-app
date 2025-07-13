import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-details',
  imports: [RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserDetail();
  }

  private loadUserDetail(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        this.fetchUser(id);
      } else {
        this.error.set('Invalid user ID');
      }
    } else {
      this.error.set('User ID not provided');
    }
  }

  private fetchUser(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load user details');
        this.loading.set(false);
        console.error('Error loading user:', error);
      }
    });
  }

  async deleteUser(): Promise<void> {
    const currentUser = this.user();
    if (!currentUser) return;

    const confirmDelete = confirm(`Are you sure you want to delete ${currentUser.name}?`);

    if (confirmDelete) {
      try {
        this.loading.set(true);
        await this.userService.deleteUser(currentUser.id);
        this.router.navigate(['/users']);
      } catch (error) {
        this.error.set('Failed to delete user');
        this.loading.set(false);
        console.error('Error deleting user:', error);
      }
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getWebsiteUrl(website: string): string {
    if (website.startsWith('http://') || website.startsWith('https://')) {
      return website;
    }
    return `https://${website}`;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

}
