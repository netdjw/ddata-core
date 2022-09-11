
import { Component } from '@angular/core';
import { InputHelperService } from 'projects/ddata-ui-input/src/public-api';
import { DdSelectExampleService } from './dd-select-example.service';

@Component({
  selector: 'app-dd-select-examples',
  templateUrl: './dd-select-examples.component.html',
  providers: [
    InputHelperService,
    DdSelectExampleService
  ]
})
export class DdSelectExamplesComponent {
}
