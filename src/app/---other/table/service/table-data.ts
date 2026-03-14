import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableData {
  private _http = inject(HttpClient);

  private baseUrl: string = 'https://api.github.com/users';

  getUsers(pageNo: number, records: number) {
    return this._http.get(
      `${this.baseUrl}?since=${pageNo}&per_page=${records}`
    );
  }
}
