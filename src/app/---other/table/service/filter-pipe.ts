import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchText: string, field: string): any[] {
    if (!value) return [];
    if (!searchText) return value;

    return value.filter((item) => {
      const fieldValue = item[field];
      if (fieldValue && typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(searchText.toLowerCase());
      }
      return false;
    });
  }
}
