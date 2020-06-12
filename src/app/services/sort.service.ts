import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap, take, map } from 'rxjs/operators';
import {
  SortColumn,
  SortDirection,
} from '../shared/directive/sortable.directive';

interface SearchResult {
  items: any[];
  total: number;
}

interface State {
  items: any[];
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  filterColumns: string[];
}

const compare = (v1: string, v2: string) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(items: any[], column: SortColumn, direction: string): any[] {
  if (direction === '' || column === '') {
    return items;
  } else {
    return [...items].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(item: any, cols: string[], term: string, pipe: PipeTransform) {
  if (!term) {
    return true;
  }

  for (let col of cols) {
    if (item[col].toLowerCase().includes(term.toLowerCase())) {
      return true;
    }
  }

  return false;
}

@Injectable({ providedIn: 'root' })
export class SortService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _items$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    items: [],
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    filterColumns: [],
  };

  constructor(private pipe: DecimalPipe) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._items$.next(result.items);
        this._total$.next(result.total);
      });
  }

  setItems(items: any[]) {
    this._state.items = items;
    this._search$.next();
  }

  get items$() {
    return this._items$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      filterColumns,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    let items = sort(this._state.items, sortColumn, sortDirection);

    // 2. filter
    items = items.filter((item) =>
      matches(item, filterColumns, searchTerm, this.pipe)
    );
    const total = items.length;

    // 3. paginate
    items = items.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );

    return of({ items, total });
  }
}
