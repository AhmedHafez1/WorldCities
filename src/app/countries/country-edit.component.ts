import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseFormComponent } from '../base-form.component';
import { Country } from './country';
import { CountryService } from './country.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.scss'],
})
export class CountryEditComponent extends BaseFormComponent implements OnInit {
  // the view title
  title?: string;

  // the country object to edit or create
  country?: Country;

  id?: number;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField.bind(this, 'name')],
      iso2: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)],
        this.isDupeField.bind(this, 'iso2'),
      ],
      iso3: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]{3}$/)],
        this.isDupeField.bind(this, 'iso3'),
      ],
    });
  }

  loadData() {
    // retrieve the ID from the 'id' parameter
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    if (this.id) {
      // EDIT MODE
      // fetch the country from the server
      this.countryService.get(this.id).subscribe((result) => {
        this.country = result;
        this.title = 'Edit - ' + this.country.name;
        // update the form with the country value
        this.form.patchValue(this.country);
      });
    } else {
      // ADD NEW MODE
      this.title = 'Create a new Country';
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.id) {
        // EDIT mode
        this.countryService
          .edit({ ...this.form.value, id: this.id })
          .subscribe((result) => {
            console.log('Country ' + this.id + ' has been updated.');
            // go back to countries view
            this.router.navigate(['/countries']);
          });
      } else {
        // ADD NEW mode
        var url = environment.baseUrl + 'api/Countries';
        this.countryService.add(this.form.value).subscribe((result) => {
          console.log('Country ' + result.id + ' has been created.');
          // go back to countries view
          this.router.navigate(['/countries']);
        });
      }
    }
  }

  isDupeField(fieldName: string): Observable<{
    [key: string]: boolean;
  } | null> {
    return this.countryService.isDupeField(
      fieldName,
      this.form.controls[fieldName].value,
      this.id?.toString()
    );
  }
}
