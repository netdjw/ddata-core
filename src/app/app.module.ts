import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DdataUiInputModule, InputHelperService } from '../../projects/ddata-ui-input/src/public-api';
import { DdataCoreModule, ValidatorService } from 'ddata-core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DdSelectExamplesComponent } from './dd-select-examples/dd-select-examples.component';
import { DdSelectSimpleExamplesComponent } from './dd-select-examples/simple/dd-select-simple-examples.component';
import { DdSelectMultipleBasicExamplesComponent } from './dd-select-examples/multiple-basic/dd-select-multiple-basic-examples.component';
import { TagListComponent } from './dd-select-examples/tag-list/tag-list.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { DdSelectSingleExamplesComponent } from './dd-select-examples/single/dd-select-single-examples.component';
import { CountryListComponent } from './dd-select-examples/country-list/country-list.component';
import { ClearModelPipe } from './pipes/clear-model.pipe';
import { PrettyJsonPipe } from './pipes/pretty-json.pipe';

@NgModule({
  declarations: [
    AppComponent,
    DdSelectExamplesComponent,
    DdSelectSimpleExamplesComponent,
    DdSelectMultipleBasicExamplesComponent,
    DdSelectSingleExamplesComponent,
    TagListComponent,
    CountryListComponent,
    ClearModelPipe,
    PrettyJsonPipe,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DdataUiInputModule,
    DdataCoreModule.forRoot(environment),
    RouterModule.forRoot([]),
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  providers: [
    InputHelperService,
    ValidatorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
