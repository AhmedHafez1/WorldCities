import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { City } from './city';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
})
export class CitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'edit'];
  public cities!: MatTableDataSource<City>;

  private defaultPageIndex = 0;
  private defaultPageSize = 10;

  defaultFilterColumn = 'name';
  filterText?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(filterText?: string) {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterText = filterText;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    let params = new HttpParams()
      .set('pageIndex', event.pageIndex)
      .set('pageSize', event.pageSize)
      .set('sortColumn', this.sort?.active || 'name')
      .set('sortOrder', this.sort?.direction || 'asc');

    if (this.filterText) {
      params = params
        .set('filterColumn', this.defaultFilterColumn)
        .set('filterText', this.filterText);
    }

    this.http
      .get<any>(environment.baseUrl + 'api/Cities', { params })
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
}
