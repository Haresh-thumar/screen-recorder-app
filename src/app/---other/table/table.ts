import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableData } from './service/table-data';
import { FilterPipe } from './service/filter-pipe';

@Component({
  selector: 'app-table',
  imports: [FormsModule, FilterPipe],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  private _userService = inject(TableData);

  allUsers: any[] = []; // Store All User Data

  pageNo = 1;
  records = 15;
  search: string = '';

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this._userService
      .getUsers(this.pageNo, this.records)
      .subscribe((res: any) => {
        this.allUsers = res;
      });
  }

  clearFilter() {
    this.search = '';
  }

  prevRecord() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getAllUsers();
    }
  }
  nextRecord() {
    this.pageNo++;
    this.getAllUsers();
  }
}
