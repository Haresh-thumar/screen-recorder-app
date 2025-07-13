import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateUserDto, UpdateUserDto, User } from '../../model/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {

  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  loading = signal(false);
  error = signal<string | null>(null);
  isEditMode = signal(false);
  userId = signal<number | null>(null);
  userForm: FormGroup<any> = this.userService.initializeForm();

  ngOnInit(): void {
    this.checkEditMode();
  }

  private async checkEditMode(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && idParam !== 'new') {
      const id = parseInt(idParam, 10);
      if (!isNaN(id)) {
        this.isEditMode.set(true);
        this.userId.set(id);
        await this.loadUserData(id);
      }
    }
  }

  private async loadUserData(id: number): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      this.userService.getUserById(id).subscribe({
        next: (user: User) => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website,
            address: {
              street: user.address?.street || '',
              suite: user.address?.suite || '',
              city: user.address?.city || '',
              zipcode: user.address?.zipcode || ''
            },
            company: {
              name: user.company?.name || ''
            }
          });
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to load user data');
          this.loading.set(false);
          console.error('Error loading user:', error);
        }
      });
    } catch (error) {
      this.error.set('Failed to load user data');
      this.loading.set(false);
      console.error('Error loading user:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.valid) {
      try {
        this.loading.set(true);
        this.error.set(null);

        const formData = this.userForm.value;

        if (this.isEditMode()) {
          const updateData: UpdateUserDto = {
            id: this.userId()!,
            ...formData
          };
          await this.userService.updateUser(this.userId()!, updateData);
        } else {
          const createData: CreateUserDto = formData;
          await this.userService.createUser(createData);
        }

        this.router.navigate(['/users']);
      } catch (error) {
        this.error.set(`Failed to ${this.isEditMode() ? 'update' : 'create'} user`);
        console.error('Error saving user:', error);
      } finally {
        this.loading.set(false);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.userForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

}
