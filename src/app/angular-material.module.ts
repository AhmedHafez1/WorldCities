import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, MatTableModule],
  exports: [MatButtonModule, MatIconModule, MatToolbarModule, MatTableModule],
})
export class AngularMaterialModule {}
