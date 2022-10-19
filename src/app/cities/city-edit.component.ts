import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { City } from './city';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent implements OnInit {
  title: string = 'Edit City';
  form!: FormGroup;
  id!: number;
  city!: City;
  private url = environment.baseUrl + 'api/Cities/';

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
    });

    this.loadData();
  }

  loadData() {
    const paramId = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = paramId ? +paramId : 0;

    this.http.get<City>(this.url + this.id).subscribe((result) => {
      this.city = result;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.http
        .put<City>(this.url + this.id, {
          ...this.form.value,
          id: this.id,
          countryId: this.city.countryId,
        })
        .subscribe((result) => {
          console.log('City ' + this.id + ' has been updated.\n' + result);
          this.router.navigate(['/cities']);
        });
    }
  }
}
