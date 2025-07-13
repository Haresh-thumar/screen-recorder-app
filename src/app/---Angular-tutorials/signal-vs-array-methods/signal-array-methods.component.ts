import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-array-methods',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './signal-array-methods.component.html',
  styleUrl: './signal-array-methods.component.scss',
})
export class ArrayMethodsComponent {
  /************************************************************************************************
                                                length
  ************************************************************************************************/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrayLength: any[] = ['California', 'Barcelona', 'Paris', 'Kathmandu'];
  arrlength?: number;
  arrLength() {
    this.arrlength = this.arrayLength.length;
  }
  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signallength = signal(['California', 'Barcelona', 'Paris', 'Kathmandu']);
  sigLength = signal(0);
  signalLength() {
    this.sigLength.set(this.signallength().length);
  }

  /*--************************************************************************************************
                                                Reverse
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrayReverse: any[] = [1, 2, 3, 4, 5];
  arrreverse() {
    this.arrayReverse = this.arrayReverse.reverse();
  }
  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signalReverse = signal([1, 2, 3, 4, 5]);
  signalreverse() {
    this.signalReverse.set(this.signalReverse().reverse());
  }

  /*--************************************************************************************************
                                                 Sort
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arraySort = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  arrSortAscending() {
    this.arraySort.sort((a, b) => a.localeCompare(b));
  }
  arrSortDescending() {
    this.arraySort.sort((a, b) => b.localeCompare(a));
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signalSort = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

  sigSortAscending() {
    this.signalSort.update(currentValue =>
      [...currentValue].sort((a, b) => a.localeCompare(b))
    );
  }
  sigSortDescending() {
    this.signalSort.update(currentValue =>
      [...currentValue].sort((a, b) => b.localeCompare(a))
    );
  }


  /*--************************************************************************************************
                                                  Fill
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrFill = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  arrayFill() {
    this.arrFill.fill('filled', 2, 6);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signFill = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);

  signalFill() {
    this.signFill.update(currentValue => {
      const newArray = [...currentValue];
      newArray.fill('filled', 2, 6);
      return newArray;
    });
  }

  /*--************************************************************************************************
                                                  Join
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrJoin = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  arrJoinResult = '';

  arrayJoin() {
    this.arrJoinResult = this.arrJoin.join('-');
  }
  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signJoin = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  signJoinResult = signal('');

  signalJoin() {
    this.signJoinResult.set(this.signJoin().join('-'));
  }

  /*--************************************************************************************************
                                                  toString
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrToString = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  arrToStringResult = '';

  arrayToString() {
    this.arrToStringResult = this.arrToString.toString();
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signToString = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  signToStringResult = signal('');

  signalToString() {
    this.signToStringResult.set(this.signToString().toString());
  }

  /*--************************************************************************************************
                                                  Pop
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrPop = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  arrPoppedElement?: string = '';

  arrayPop() {
    this.arrPoppedElement = this.arrPop.pop();
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signPop = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  signPoppedElement: any = signal<string>('');

  signalPop() {
    this.signPop.update(currentValue => {
      const newArray = [...currentValue];
      const poppedElement = newArray.pop();
      this.signPoppedElement.set(poppedElement);
      return newArray;
    });
  }

  /*--************************************************************************************************
                                                  Shift
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrShift = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  arrShiftedElement?: string = '';

  arrayShift() {
    this.arrShiftedElement = this.arrShift.shift();
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signShift = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  signShiftedElement: any = signal<string>('');

  signalShift() {
    this.signShift.update(currentValue => {
      const newArray = [...currentValue];
      const shiftedElement = newArray.shift();
      this.signShiftedElement.set(shiftedElement);
      return newArray;
    });
  }

  /*--************************************************************************************************
                                                  Push
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrPush = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  newItem = 'ten';

  arrayPush() {
    this.arrPush.push(this.newItem);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signPush = signal(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']);
  newItemSignal = signal('ten');

  signalPush() {
    this.signPush.update(currentValue => {
      const newArray = [...currentValue, this.newItemSignal()];
      return newArray;
    });
  }

  /*--************************************************************************************************
                                                  Unshift
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrUnshift = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  unshiftItemArr = 'one';

  arrayUnshift() {
    this.arrUnshift.unshift(this.unshiftItemArr);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signUnshift = signal(['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']);
  unshiftItemSignal = signal('one');

  signalUnshift() {
    this.signUnshift.update(currentValue => {
      const newArray = [this.unshiftItemSignal(), ...currentValue];
      return newArray;
    });
  }

  /*--************************************************************************************************
                                                  Concat
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrConcat = ['one', 'two'];
  otherArr = ['three', 'four'];
  combinedArray?: any[];

  arrayConcat() {
    this.combinedArray = this.arrConcat.concat(this.otherArr);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signConcat = signal(['one', 'two']);
  otherSign = signal(['three', 'four']);
  combinedSignal = signal<string[]>([]);

  signalConcat() {
    this.combinedSignal.update(currentValue => {
      return currentValue.concat(this.signConcat(), this.otherSign());
    });
  }

  /*--************************************************************************************************
                                                  Splice
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrSplice = ['one', 'two', 'three', 'four'];

  arraySplice(index: number, deleteCount: number) {
    this.arrSplice.splice(index, deleteCount);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signSplice = signal(['one', 'two', 'three', 'four']);

  signalSplice(index: number, deleteCount: number) {
    this.signSplice.update(currentValue => {
      const newArray = [...currentValue];
      newArray.splice(index, deleteCount);
      return newArray;
    });
  }

  /*--************************************************************************************************
                                                LastIndexOf
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrLastIndexOf = ['one', 'two', 'three', 'four', 'five'];
  searchValue = '';
  lastIndex?: number;

  findLastIndexArray() {
    this.lastIndex = this.arrLastIndexOf.lastIndexOf(this.searchValue);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signLastIndexOf = signal(['one', 'two', 'three', 'four', 'five']);
  signalLastIndex = signal(0);

  findLastIndexSignal() {
    this.signalLastIndex.set(this.signLastIndexOf().lastIndexOf(this.searchValue));
  }

  /*--************************************************************************************************
                                                  IndexOf
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrIndexOf = ['one', 'two', 'three', 'four', 'five'];
  arraySearchValue = '';
  arrayIndex: number | undefined;

  indexArray() {
    this.arrayIndex = this.arrIndexOf.indexOf(this.arraySearchValue);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signIndexOf = signal(['one', 'two', 'three', 'four', 'five']);
  signalIndex = signal<number | undefined>(undefined);
  signalSearchValue = signal('');

  indexSignal() {
    this.signalIndex.set(this.signIndexOf().indexOf(this.signalSearchValue()));
  }

  updateSignalSearchValue(event: Event) {
    const target = event.target as HTMLInputElement;
    this.signalSearchValue.set(target.value);
  }

  /*--************************************************************************************************
                                                  Slice
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrSlice = ['one', 'two', 'three', 'four', 'five'];
  arrayStartIndex = 0;
  arrayEndIndex = 0;
  arraySliceResult: string[] = [];

  sliceArray() {
    this.arraySliceResult = this.arrSlice.slice(this.arrayStartIndex, this.arrayEndIndex || undefined);
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signSlice = signal(['one', 'two', 'three', 'four', 'five']);
  signalStartIndex = signal(0);
  signalEndIndex = signal(0);
  signalSliceResult = signal<string[]>([]);

  sliceSignal() {
    this.signalSliceResult.set(
      this.signSlice().slice(this.signalStartIndex(), this.signalEndIndex() || undefined)
    );
  }

  updateSignalStartIndex(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.signalStartIndex.set(parseInt(value) || 0);
  }

  updateSignalEndIndex(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.signalEndIndex.set(parseInt(value) || 0);
  }

  /*--************************************************************************************************
                                                FindIndex
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrFindIndex = [10, 20, 30, 40, 50];
  arrSearchValue: number = 0;
  arrayFindIndexResult: number = -1;

  findIndexArray() {
    this.arrayFindIndexResult = this.arrFindIndex.findIndex(
      num => num > this.arrSearchValue
    );
  }

  /*-----------------------------------------
                    Signal
  -----------------------------------------*/
  signFindIndex = signal([10, 20, 30, 40, 50]);
  sigSearchValue = signal(0);
  signalFindIndexResult = signal(-1);

  findIndexSignal() {
    this.signalFindIndexResult.set(
      this.signFindIndex().findIndex(num => num > this.sigSearchValue())
    );
  }

  updateSignalSearchValues(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.sigSearchValue.set(parseInt(value) || 0);
  }

  /*--************************************************************************************************
                                                  Find
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrFind = [10, 20, 30, 40, 50];
  arrSearchValue1: number = 0;
  arrayFindResult: number | undefined;

  findArray() {
    this.arrayFindResult = this.arrFind.find(num => num > this.arrSearchValue);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signFind = signal([10, 20, 30, 40, 50]);
  sigSearchValue1 = signal(0);
  signalFindResult = signal<number | undefined>(undefined);

  findSignal() {
    this.signalFindResult.set(
      this.signFind().find(num => num > this.sigSearchValue())
    );
  }

  updateSignalSearchValue1(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.sigSearchValue.set(parseInt(value) || 0);
  }


  /*--************************************************************************************************
                                                Include
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrInclude = [10, 20, 30, 40, 50];
  arrSearchValue2: number = 0;
  arrayIncludesResult: boolean = false;

  includesArray() {
    this.arrayIncludesResult = this.arrInclude.includes(this.arrSearchValue2);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signInclude = signal([10, 20, 30, 40, 50]);
  sigSearchValue2 = signal(0);
  signalIncludesResult = signal<boolean>(false);

  includesSignal() {
    this.signalIncludesResult.set(
      this.signInclude().includes(this.sigSearchValue2())
    );
  }

  includeSignalValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.sigSearchValue2.set(parseInt(value) || 0);
  }

  /*--************************************************************************************************
                                                Reduce
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  arrReduce: number[] = [10, 20, 30, 40, 50];
  arrSearchValue3: number = 0;
  arrayReduceResult: number = 0;

  reduceArray() {
    this.arrayReduceResult = this.arrFind.reduce((sum, num) =>
      num > this.arrSearchValue3 ? sum + num : sum, 0);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signReduce = signal([10, 20, 30, 40, 50]);
  sigSearchValue3 = signal(0);
  signalReduceResult = signal<number>(0);

  reduceSignal() {
    this.signalReduceResult.set(
      this.signFind().reduce((sum, num) =>
        num > this.sigSearchValue3() ? sum + num : sum, 0)
    );
  }

  /*--************************************************************************************************
                                                isArray
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  regularArray = [1, 2, 3, 4, 5];
  regularNonArray = 'This is not an array';
  regularIsArrayResult = false;

  checkRegularIsArray(value: any) {
    this.regularIsArrayResult = Array.isArray(value);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signalArray = signal([1, 2, 3, 4, 5]);
  signalNonArray = signal('This is not an array');
  signalIsArrayResult = signal(false);

  checkSignalIsArray(value: any) {
    this.signalIsArrayResult.set(Array.isArray(value()));
  }

  /*--************************************************************************************************
                                                Filter
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  filterArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  regularFilterThreshold = 0;
  regularFilterResult: number[] = [];

  filterRegularArray() {
    this.regularFilterResult = this.filterArray.filter(num => num > this.regularFilterThreshold);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signalFilterArray = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  signalFilterThreshold = signal(0);
  signalFilterResult = signal<number[]>([]);

  filterSignalArray() {
    this.signalFilterResult.set(
      this.signalFilterArray().filter(num => num > this.signalFilterThreshold())
    );
  }

  updateSignalThreshold(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.signalFilterThreshold.set(parseInt(value) || 0);
  }

  /*--************************************************************************************************
                                                Map
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  mapArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  regularMultiplier = 2;
  regularMapResult: number[] = [];

  mapRegularArray() {
    this.regularMapResult = this.mapArray.map(num => num * this.regularMultiplier);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signalMapArray = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  signalMultiplier = signal(0);
  signalMapResult = signal<number[]>([]);

  mapSignalArray() {
    this.signalMapResult.set(
      this.signalMapArray().map(num => num * this.signalMultiplier())
    );
  }

  updateSignalMapThreshold(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.signalMultiplier.set(parseInt(value) || 1);
  }

  /*--************************************************************************************************
                                                ForEach
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  forEachArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  foreachMultiplier = 2;
  regularForEachResult: number[] = [];

  forEachRegularArray() {
    this.regularForEachResult = [];
    this.forEachArray.forEach(num => {
      this.regularForEachResult.push(num * this.foreachMultiplier);
    });
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signalForEachArray = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  signalForeachMultiplier = signal(2);
  signalForEachResult = signal<number[]>([]);

  forEachSignalArray() {
    const result: number[] = [];
    this.signalForEachArray().forEach(num => {
      result.push(num * this.signalForeachMultiplier());
    });
    this.signalForEachResult.set(result);
  }

  updateSignalForEachThreshold(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.signalForeachMultiplier.set(parseInt(value) || 1);
  }

  /*--************************************************************************************************
                                                Some
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  someArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  someThreshold = 5;
  regularSomeResult = false;

  checkRegularArray() {
    this.regularSomeResult = this.someArray.some(num => num > this.someThreshold);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  signalSomeArray = signal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  signalSomeThreshold = signal(5);
  signalSomeResult = signal(false);

  checkSomeSignalArray() {
    const result = this.signalSomeArray().some(num => num > this.signalSomeThreshold());
    this.signalSomeResult.set(result);
  }

  updateSignalSomeMethod(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.signalSomeThreshold.set(parseInt(value) || 0);
  }

  /*--************************************************************************************************
                                                Every
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  everyArray = [60, 70, 80, 90, 100];
  everyThreshold = 0;
  everyResult = false;

  verifyEveryArray() {
    this.everyResult = this.everyArray.every(num => num > this.everyThreshold);
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  everySignalArray = signal([60, 70, 80, 90, 100]);
  everySignalThreshold = signal(0);
  everySignalResult = signal(false);

  verifyReactiveArray() {
    const result = this.everySignalArray().every(num => num > this.everySignalThreshold());
    this.everySignalResult.set(result);
  }

  updateReactiveThreshold(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.everySignalThreshold.set(parseInt(value) || 0);
  }

  /*--************************************************************************************************
                                                Entries
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  entriesArray = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  entriesResult: [number, string][] = [];

  entriesMethod() {
    this.entriesResult = Array.from(this.entriesArray.entries());
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  entriesSignal = signal(['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']);
  entriesSignalResult = signal<[number, string][]>([]);

  displayReactiveEntries() {
    const entries = Array.from(this.entriesSignal().entries());
    this.entriesSignalResult.set(entries);
  }

  /*--************************************************************************************************
                                                Keys
  ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  keysArray = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  keyArrayResult: number[] = [];

  keysMethod() {
    this.keyArrayResult = Array.from(this.keysArray.keys());
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  keysSignal = signal(['Figs', 'Grapes', 'Honeydew', 'Imbe', 'Jackfruit']);
  keySignalResult = signal<number[]>([]);

  showDynamicKeys() {
    const keys = Array.from(this.keysSignal().keys());
    this.keySignalResult.set(keys);
  }


  /*--************************************************************************************************
                                                  Values
    ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  valuesArray = ['Red', 'Green', 'Blue', 'Yellow', 'Purple'];
  valuesArrayResult: string[] = [];

  arrayValuesMethod() {
    this.valuesArrayResult = Array.from(this.valuesArray.values());
  }

  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  valuesSignal = signal(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  valuesSignalResult = signal<string[]>([]);

  signalValuesMethod() {
    const values = Array.from(this.valuesSignal().values());
    this.valuesSignalResult.set(values);
  }

  /*--************************************************************************************************
                                                  From
    ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  fromArray = ['Red', 'Green', 'Blue', 'Yellow', 'Purple'];
  arrayFromResult: string[] = [];

  arrayFromMethod() {
    this.arrayFromResult = Array.from(this.fromArray);
  }
  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  fromSignal = signal(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  signalFromResult = signal<string[]>([]);

  signalFromMethod() {
    const values = Array.from(this.fromSignal());
    this.signalFromResult.set(values);
  }

  /*--************************************************************************************************
                                                  toLocalString
    ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  toLocalStringArray = [12345.67, 8901.23, 456.78, 155.55, 4849, 946.6, 2641.0];
  formattoLocalStringArray: string[] = [];

  formatArray() {
    this.formattoLocalStringArray = this.toLocalStringArray.map(number =>
      number.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    );
  }
  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  toLocalStringSignal = signal([12345.67, 8901.23, 456.78, 155.55, 4849, 946.6, 2641.0]);
  formattoLocalStringSignal = signal<string[]>([]);

  formatSignalArray() {
    const formatted = this.toLocalStringSignal().map(number =>
      number.toLocaleString('de-DE', { style: 'percent' })
    );
    this.formattoLocalStringSignal.set(formatted);
  }

  /*--************************************************************************************************
                                                  Flap
    ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  flatArray = [[1, 2, 3], [10, 11, 12], [4, 5, 6]];
  flattenedArrayResult: number[] = [];

  flattenArray() {
    this.flattenedArrayResult = this.flatArray.flat();
  }
  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  flatSignal = signal([[1, 2, 3], [10, 11, 12], [4, 5, 6]]);
  flattenedSignalResult = signal<number[]>([]);

  flattenSignal() {
    const flattened = this.flatSignal().flat();
    this.flattenedSignalResult.set(flattened);
  }

  /*--************************************************************************************************
                                                  FlatMap
    ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  flatMapArray = [[1, 2, 3], [10, 11, 12], [4, 5, 6]];
  flattenedMapArrayResult: number[] = [];

  flatMapArrayMethod() {
    this.flattenedMapArrayResult = this.flatMapArray.flatMap(subArray => subArray.map(num => num * 2));
  }
  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  flatMapSignal = signal([[1, 2, 3], [10, 11, 12], [4, 5, 6]]);
  flattenedMapSignalResult = signal<number[]>([]);

  flattenSignalMethod() {
    const flattened = this.flatMapSignal().flatMap(subArray => subArray.map(num => num * 2));
    this.flattenedMapSignalResult.set(flattened);
  }

  /*--************************************************************************************************
                                                  copyWithin
    ************************************************************************************************--*/
  /*-----------------------------------------
                    Array
  -----------------------------------------*/
  copyWithinArray = ["apple", "ball", "cat", "dog", "donkey", "monkey"];
  copyWithinArray2 = ["apple", "ball", "cat", "dog", "donkey", "monkey"];
  copyWithinedArrayResult: any[] = [];

  copyWithinArrayMethod() {
    this.copyWithinedArrayResult = this.copyWithinArray2.copyWithin(2, 0, 3);
  }
  /*-----------------------------------------
                    Signal 
  -----------------------------------------*/
  copyWithinSignal = signal(["apple", "ball", "cat", "dog", "donkey", "monkey"]);
  copyWithinSignal2 = signal(["apple", "ball", "cat", "dog", "donkey", "monkey"]);
  copyWithinSignalResult = signal<any[]>([]);

  copyWithinSignalMethod() {
    const copied = this.copyWithinSignal2().copyWithin(2, 0, 3);
    this.copyWithinSignalResult.set(copied);
  }
}
