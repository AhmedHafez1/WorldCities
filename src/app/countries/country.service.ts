import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResult, BaseService } from '../base.service';
import { Country } from './country';

@Injectable({
  providedIn: 'root',
})
export class CountryService extends BaseService<Country> {
  constructor(http: HttpClient) {
    super(http);
  }
  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn?: string | undefined,
    filterText?: string | undefined
  ): Observable<ApiResult<Country>> {
    const url = this.getUrl('api/Countries');

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

    return this.http.get<ApiResult<Country>>(url, { params });
  }

  get(id: number): Observable<Country> {
    const url = this.getUrl('api/Countries/' + id);
    return this.http.get<Country>(url);
  }

  edit(item: Country): Observable<Country> {
    const url = this.getUrl('api/Countries/' + item.id);
    return this.http.put<Country>(url, item);
  }

  add(item: Country): Observable<Country> {
    const url = this.getUrl('api/Countries/');
    return this.http.post<Country>(url, item);
  }

  isDupeField(
    fieldName: string,
    fieldValue: string | number | boolean,
    countryId = '0'
  ): Observable<{
    [key: string]: boolean;
  } | null> {
    const url = this.getUrl('api/Countries/IsDupeField');

    const params = new HttpParams()
      .set('countryId', countryId)
      .set('fieldName', fieldName)
      .set('fieldValue', fieldValue);

    return this.http.post<boolean>(url, null, { params }).pipe(
      map((result) => {
        return result ? { isDupeField: true } : null;
      })
    );
  }
}
