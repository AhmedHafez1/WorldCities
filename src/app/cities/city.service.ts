import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult, BaseService } from '../base.service';
import { Country } from '../countries/country';
import { City } from './city';

@Injectable({
  providedIn: 'root',
})
export class CityService extends BaseService<City> {
  constructor(http: HttpClient) {
    super(http);
  }

  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn?: string,
    filterText?: string
  ): Observable<ApiResult<City>> {
    const url = this.getUrl('api/Cities');

    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder);

    if (filterColumn && filterText) {
      params = params
        .set('filterColumn', filterColumn)
        .set('filterText', filterText);
    }

    return this.http.get<ApiResult<City>>(url, { params });
  }

  get(id: number): Observable<City> {
    const url = this.getUrl('api/Cities/' + id);
    return this.http.get<City>(url);
  }
  edit(item: City): Observable<City> {
    const url = this.getUrl('api/Cities/' + item.id);
    return this.http.put<City>(url, item);
  }
  add(item: City): Observable<City> {
    const url = this.getUrl('api/Cities');
    return this.http.post<City>(url, item);
  }

  getCountries(): Observable<ApiResult<Country>> {
    // fetch all the countries from the server
    var url = this.getUrl('api/Countries');
    var params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '999')
      .set('sortColumn', 'name');
    return this.http.get<ApiResult<Country>>(url, { params });
  }

  isCityExist(city: City): Observable<boolean> {
    const url = this.getUrl('api/Cities/IsCityExist');
    return this.http.post<boolean>(url + 'IsCityExist', city);
  }
}
