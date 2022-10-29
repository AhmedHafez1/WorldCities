import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BaseFormComponent } from '../base-form.component';
import { Country } from '../countries/country';
import { City } from './city';
import { CityService } from './city.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss'],
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  title!: string;
  id!: number;
  city!: City;
  countries?: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        lat: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/),
        ]),
        lon: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/),
        ]),
        countryId: new FormControl('', Validators.required),
      },
      null,
      this.isCityExist.bind(this)
    );

    this.loadData();
  }

  loadData() {
    this.loadCountries();

    const paramId = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = paramId ? +paramId : 0;

    if (this.id) {
      this.cityService.get(this.id).subscribe((result) => {
        this.city = result;
        this.form.patchValue(result);
        this.title = `Edit - ${result.name}`;
      });
    } else {
      this.title = `Create New City`;
    }
  }

  loadCountries() {
    this.cityService.getCountries().subscribe((result) => {
      this.countries = result.data;
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.id) {
        this.cityService
          .edit({
            ...this.form.value,
            id: this.id,
          })
          .subscribe((result) => {
            console.log('City ' + this.id + ' has been updated.\n' + result);
            this.router.navigate(['/cities']);
          });
      } else {
        this.cityService.add(this.form.value).subscribe((result) => {
          console.log('City ' + result.id + ' has been updated.\n' + result);
          this.router.navigate(['/cities']);
        });
      }
    }
  }

  private isCityExist(): Observable<{ [key: string]: boolean } | null> {
    return this.cityService
      .isCityExist({ ...this.form.value, id: this.id ?? 0 })
      .pipe(
        map((result) => {
          return result ? { isCityExist: true } : null;
        })
      );
  }
}
