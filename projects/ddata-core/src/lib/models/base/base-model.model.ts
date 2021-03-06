// tslint:disable: max-line-length
// tslint:disable: variable-name
import { DdataCoreModule } from '../../ddata-core.module';
import { ValidatorServiceInterface } from '../../services/validator/validator-service.interface';
import { ValidatorService } from '../../services/validator/validator.service';
import { ValidationErrorSettingsInterface } from '../error/validation-error-settings.model';
import { ValidationError } from '../error/validation-error.model';
import { ID, ISODate } from './base-data.type';

export interface FieldInterface {
  label: string;
  title: string;
  placeholder?: string;
  append?: string;
  prepend?: string;
  validateByType?: boolean;
  validationRules?: Rule[];
  additionalValidationRules?: Rule[];
}

export type FieldContainerInterface<T> = {
  [key in keyof T]: FieldInterface;
};

export interface FieldColumnInterface<T> {
  cssClass?: string;
  cssId?: string;
  cssStyle?: string;
  fields: FieldContainerInterface<T>[];
}

export interface TabInterface<T> {
  title: string;
  label: string;
  cssId?: string;
  cssClass?: string;
  columns: FieldColumnInterface<T>[];
}

type Rule = 'string' | 'boolean' | 'number' | 'integer' | 'required' | 'nullable' | 'name' | 'email' | 'domain' | 'url' |
  'iso_date' | 'driving_licence' | 'id_card_number' | 'address_card_number' | 'phonenumber' | 'bankaccount' |
  'taxnumber' | 'social_insurance_number' | 'not_zero' | 'lang' | 'register_number' |
  'array' | 'not_empty' | 'empty' | 'person_taxnumber' | 'color_code' | 'iban_code' | 'swift_code';

export interface ValidationRuleInterface {
  [key: string]: Rule[];
}

export interface BaseModelWithoutTypeDefinitionInterface  {
  readonly api_endpoint: string;
  readonly use_localstorage: boolean;
  readonly model_name: string;
  id: ID;
  isValid: boolean;
  validationErrors: string[];
  validationRules: ValidationRuleInterface;
  init(data?: any): any;
  prepareToSave(): any;
  validate(): void;
  getValidatedErrorFields(): string[];
  setDate(date: Date, days: number): ISODate;
  getCurrentUserId(): ID;
  getCurrentISODate(): ISODate;
  toISODate(date: Date): ISODate;
  calculateDateWithoutWeekend(date: string, days: number, sequence: string): ISODate;
}

export interface FieldsInterface<T> {
  fields: FieldContainerInterface<T>;
}

export interface BaseModelInterface<T> extends BaseModelWithoutTypeDefinitionInterface {
  tabs?: TabInterface<T>;
}

// tslint:disable-next-line: no-empty-interface
interface ModelWithId {
}

export class BaseModel implements BaseModelInterface<ModelWithId> {
  id: ID;
  api_endpoint = '/you/must/be/define/api_endpoint/in/your/model';
  use_localstorage = false;
  model_name = 'NotDefined';
  isValid = false;
  validationErrors: string[] = [];
  validationRules: ValidationRuleInterface = {};

  fields: FieldContainerInterface<ModelWithId> = {};

  init(data: any = null): any {
      throw new Error('init() function is not implemented');
  }

  prepareToSave(): any {
      throw new Error('prepareToSave() function is not implemented');
  }

  validate(preparedData?: any): void {
    const validatorService: ValidatorServiceInterface = DdataCoreModule.InjectorInstance.get<ValidatorServiceInterface>(ValidatorService);

    try {
      [this.isValid, this.validationErrors] = validatorService.validateObject(
        !!preparedData ? preparedData : this.prepareToSave(), this.validationRules, true,
        {message: 'Validation Error'}
      );
    } catch (error) {
      const newErrorSettings: ValidationErrorSettingsInterface = {message: error.message};

      if (error instanceof ValidationError) {
        this.validationErrors = error.invalids;
        this.isValid = false;
        newErrorSettings.invalids = this.getValidatedErrorFields();

        throw new ValidationError(newErrorSettings);
      }

      throw error;
    }
  }

  getValidatedErrorFields(): string[] {
    const errorNames: string[] = [];

    this.validationErrors.forEach((item: string) => {
      errorNames.push(!!this.fields[item] ? this.fields[item].label : item);

      if (!this.fields[item]) {
        console.error(`${item} nevű mező nem található ezen a model-en: ${this.model_name}`, this);
      }
    });

    return errorNames;
  }

  setDate(date: Date, days = 0): ISODate {
    const new_date = new Date(date.setDate(date.getDate() + Number(days))).toISOString().split('T')[0];

    return new_date as ISODate;
  }

  /**
   * Return current date as ISODate
   */
  getCurrentISODate(): ISODate {
    return new Date().toISOString().split('T')[0] as ISODate;
  }

  /**
   * Return a date as ISODate
   */
  toISODate(date: Date): ISODate {
    return date.toISOString().split('T')[0] as ISODate;
  }

  /**
   * Return current user's id as ID
   */
  getCurrentUserId(): ID {
    return Number(localStorage.getItem('current_user_id')) as ID;
  }

  /**
   * Return default deviza id as ID
   */
  getDefaultDevizaId(): ID {
    return 45 as ID;
  }

  /**
   * Calculate the date with days without weekends
   *
   * @param date start date
   * @param days number of days to add
   * @param sequence - asc / desc
   */
  calculateDateWithoutWeekend(date: string, days: number, sequence: 'up' | 'down'): ISODate {
    const currentDate = new Date(date);
    let calculatedDate = '';
    let newDate = 0;

    let i = 0;
    while (i < Number(days)) {
      sequence === 'down' ? newDate = currentDate.setDate(currentDate.getDate() - 1) : newDate = currentDate.setDate(currentDate.getDate() + 1);
      const day = new Date(newDate).getDay();

      if (day > 0 && day < 6) {
          i ++;
      }
    }

    if (newDate === 0) {
      calculatedDate = new Date(date).toISOString().split('T')[0];
    } else {
      calculatedDate = new Date(newDate).toISOString().split('T')[0];
    }

    return calculatedDate as ISODate;
  }
}
