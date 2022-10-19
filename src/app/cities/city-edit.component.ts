import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Country } from '../countries/country';
import { City } from './city';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent implements OnInit {
  title!: string;
  form!: FormGroup;
  id!: number;
  city!: City;
  private url = environment.baseUrl + 'api/Cities/';
  countries?: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required),
    });

    this.loadData();
  }

  loadData() {
    this.loadCountries();

    const paramId = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = paramId ? +paramId : 0;

    if (this.id) {
      this.http.get<City>(this.url + this.id).subscribe((result) => {
        this.city = result;
        this.form.patchValue(result);
        this.title = `Edit - ${result.name}`;
      });
    } else {
      this.title = `Create New City`;
    }
  }

  loadCountries() {
    // fetch all the countries from the server
    var url = environment.baseUrl + 'api/Countries';
    var params = new HttpParams()
      .set('pageIndex', '0')
      .set('pageSize', '999')
      .set('sortColumn', 'name');
    this.http.get<any>(url, { params }).subscribe((result) => {
      this.countries = result.data;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.id) {
        this.http
          .put<City>(this.url + this.id, {
            ...this.form.value,
            id: this.id,
          })
          .subscribe((result) => {
            console.log('City ' + this.id + ' has been updated.\n' + result);
            this.router.navigate(['/cities']);
          });
      } else {
        this.http.post<City>(this.url, this.form.value).subscribe((result) => {
          console.log('City ' + result.id + ' has been updated.\n' + result);
          this.router.navigate(['/cities']);
        });
      }
    }
  }
}
