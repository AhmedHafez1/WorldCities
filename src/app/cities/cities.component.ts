import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { City } from './city';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CityService } from './city.service';
@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = [
    'id',
    'name',
    'lat',
    'lon',
    'countryName',
    'edit',
  ];
  public cities!: MatTableDataSource<City>;

  private defaultPageIndex = 0;
  private defaultPageSize = 10;

  defaultFilterColumn = 'name';
  filterText?: string;

  private filterTextChanged: Subject<string> = new Subject();

  constructor(private cityService: CityService) {}

  ngOnInit() {
    this.loadData();
    this.subscribeToFilterTextChange();
  }

  isNormalColumn(col: string) {
    return ['id', 'name', 'lat', 'lon'].includes(col);
  }

  loadData(filterText?: string) {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterText = filterText;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    this.cityService
      .getData(
        event.pageIndex,
        event.pageSize,
        this.sort?.active || 'name',
        this.sort?.direction || 'asc',
        this.defaultFilterColumn,
        this.filterText
      )
      .subscribe({
        next: (result) => {
          this.cities = new MatTableDataSource<City>(result.data);
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
        },
        error: (error) => console.error(error),
      });
  }

  onFilterTextChanged(filterText: string) {
    this.filterTextChanged.next(filterText);
  }

  subscribeToFilterTextChange() {
    this.filterTextChanged
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((filterText) => this.loadData(filterText));
  }
}
