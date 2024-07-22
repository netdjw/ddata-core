import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseModel, BaseModelInterface, DdataCoreModule, FieldsInterface } from 'ddata-core';
import { DialogContentWithOptionsInterface } from '../../models/dialog/content/dialog-content.interface';
import { InputHelperServiceInterface } from '../../services/input/helper/input-helper-service.interface';
import { InputHelperService } from '../../services/input/helper/input-helper.service';
import { SelectType } from './select.type';

@Component({
  selector: 'dd-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class DdataSelectComponent implements OnInit {
  private helperService: InputHelperServiceInterface =
    DdataCoreModule.InjectorInstance.get<InputHelperServiceInterface>(InputHelperService);
  _field = '';
  _title = '';
  _label = '';
  _prepend = '';
  _append = '';
  _isRequired = false;
  _items = [];
  _model: BaseModelInterface<any> & FieldsInterface<any> = new BaseModel();
  _selectedModelName = '';
  _mode = 'simple';

  /**
   * @deprecated use `mode` input attribute
   */
  @Input() set fakeSingleSelect(value: boolean) {
    if (value === true) {
      this._mode = 'single';
    }
  }
  /**
   * @deprecated use `mode` input attribute
   */
  get fakeSingleSelect(): boolean {
    return this._mode === 'single';
  }

  /**
   * @deprecated use `mode` input attribute
   */
  @Input() set multipleSelect(value: boolean) {
    if (value === true) {
      this._mode = 'multiple';
    }
  }
  /**
   * @deprecated use `mode` input attribute
   */
  get multipleSelect(): boolean {
    return this._mode === 'multiple';
  }

  @Input() set mode(value: SelectType) {
    this._mode = value ?? 'simple';
  }

  @Input() set model(value: BaseModelInterface<any> & FieldsInterface<any> | null) {
    if (!value) {
      return;
    }

    this._model = value;

    // if model's 'fields' is not defined or null
    if (!this._model.fields) {
      console.error(`Your ${this._model.model_name}'s 'fields' field is`, this._model.fields);

      return;
    }

    // if model's used field is not defined or null
    if (!this._model.fields[this._field]) {
      console.error(`The ${this._model.model_name}'s ${this._field} field is `, this._model.fields[this._field]);

      return;
    }

    // set texts (title, label, append, prepend) if model & fields attribute is defined too
    if (!!this._model && !!this._model.fields[this._field]) {
      this._title = this.helperService.getTitle(this._model, this._field);
      this._prepend = this.helperService.getPrepend(this._model, this._field);
      this._append = this.helperService.getAppend(this._model, this._field);
      this._label = this.helperService.getLabel(this._model, this._field);
    }

    // model is set & has validation rules for field
    if (!!this._model && !!this._model.validationRules[this._field]) {
      this._isRequired = this.helperService.isRequired(this._model, this._field);
    }

    // add 'name' property as default value on fake single select mode if model is set
    if (!!this._model && this.fakeSingleSelect) {
      this._selectedModelName = this._model['name'] ?? '';
    }
  }

  get model(): BaseModelInterface<any> & FieldsInterface<any> {
    return this._model;
  }

  @Input() set field(value: string) {
    if (value === 'undefined') {
      value = 'id';
    }

    this._field = value;
  }

  @Input() set items(value: any[] | null) {
    if (!value) {
      return;
    }

    this._items = value;
  }

  @Input() wrapperClass = 'd-flex flex-wrap';
  @Input() labelClass = 'col-12 col-md-3 px-0 col-form-label';
  @Input() inputBlockClass = 'col-12 d-flex px-0';
  @Input() inputBlockExtraClass = 'col-md-9';
  @Input() showLabel = true;
  @Input() disabledAppearance = false;
  @Input() disabled = false;
  @Input() addEmptyOption = true;
  @Input() dialogSettings: DialogContentWithOptionsInterface;
  @Input() text = 'name';
  @Input() valueField = 'id';
  @Input() unselectedText = 'Válassz';

  // selected items
  @Input() disableShowSelectedItems = false;
  @Input() showIcon = false;
  @Input() selectedElementsBlockClass = 'col-12 d-flex flex-wrap px-0';
  @Input() selectedElementsBlockExtraClass = 'col-md-9 d-flex flex-wrap';

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() selectModel: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  selectedEmit(value: any): void {
    this.selected.emit(value);
  }

  selectModelEmit(value: any): void {
    this.selectModel.emit(value);
  }
}
