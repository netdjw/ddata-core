// tslint:disable: max-line-length
import { Injectable } from '@angular/core';
import { ValidationErrorSettingsInterface } from '../../models/error/validation-error-settings.model';
import { ValidationError } from '../../models/error/validation-error.model';

@Injectable()
export class ValidatorService {
  private addressCardNumberRegExp: RegExp = new RegExp(/^([A-Z]{2}\d{6})$/);
  private bankaccountRegExp: RegExp = new RegExp(/^(\d{8}\-)(\d{8})(-\d{8})?$/);
  private colorCodeRegExp: RegExp = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  private creditCardAmericanExpressRegExp = new RegExp(/^(?:3[47][0-9]{13})$/);
  private creditCardDiscoverRegExp = new RegExp(/^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/);
  private creditCardMastercardRegExp = new RegExp(/^(?:5[1-5][0-9]{14})$/);
  private creditCardVisaRegExp = new RegExp(/^(?:4[0-9]{12}(?:[0-9]{3})?)$/);
  private domainRegExp: RegExp = new RegExp(/^(?:(?:(?:[a-zA-Z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/);
  private drivingLicenceRegExp: RegExp = new RegExp(/^([A-Z]{2}\d{6})$/);
  private emailRegExp: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  private ibanCodeRegExp: RegExp = new RegExp(/^([A-Z]{2}\d{2})|([A-Z]{4})|(\d{4})$/);
  private idCardNumberRegExp: RegExp = new RegExp(/^(([A-Z]{2}\d{6})|(\d{6}[A-Z]{2}))$/);
  private isoDateRegExp: RegExp = new RegExp(/^(\d{4})([\.\-\/])(0[0-9]|1[0-2])([\.\-\/])([0-2][0-9]|3[0-1])$/);
  private langRegExp = new RegExp(/^[A-Za-z]{2}$/);
  private nameRegExp: RegExp = new RegExp(/^([a-zA-Z]+[\.]? )*([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíúüűóöő]*)([ -]([A-ZÁÉÍÓÖŐÚÜŰ][a-záéíúüűóöő-]*))*([MD])?$/);
  private personTaxNumberRegExp: RegExp = new RegExp(/^\d{10}$/);
  private phonenumberRegExp: RegExp = new RegExp(/^[+]\d{10,}$/);
  private registerNumberRegExp: RegExp = new RegExp(/^(\d{2}\-)(\d{2})(-\d{6})$/);
  private socialInsuranceNumberRegExp: RegExp = new RegExp(/^(\d{3}[ \-]?){2}(\d{3})$/);
  private swiftCodeRegExp: RegExp = new RegExp(/^((\d{8})|(\d{11}))$/);
  private taxnumberRegExp: RegExp = new RegExp(/^(\d{8})\-\d\-(\d\d)$|^(AT|BE|BG|CY|CZ|DE|DK|EE|EL|ES|FI|FR|GB|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)\d{8}$/);
  private urlRegExp: RegExp = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/);

  /**
   * Validate JSON objects based on custom rules.
   *
   * @param data JSON object of datas
   * @param rules JSON object of rules. Each item of `rules` must be an array of validation keywords, rules.
   * @param throwError boolean, default true - if validation fails then ValidationError happen.
   *
   * ```
   * rules = {
   *   id: ['integer', 'required'],
   *   date_of_birth: ['iso_date', 'required'],
   *   passport: ['string', 'nullable'],
   *   identity_card_number: ['id_card_number', 'required']
   * }
   * ```
   */
  validateObject(data: any, rules: any, isThrowError = true, settings?: ValidationErrorSettingsInterface): [boolean, string[]] {
    const results: boolean[] = [];
    const invalids: string[] = [];

    Object.keys(rules).forEach((key: string) => {
      const fieldValidationResult = this.validate(data[key], rules[key]);
      results.push(fieldValidationResult);

      if (!fieldValidationResult) {
        invalids.push(key);
      }
    });

    const result = results.every(this.isTrue);

    if (!result && isThrowError) {
      settings.invalids = invalids;
      throw new ValidationError(settings);
    }

    return [result, invalids];
  }

  validate(data: any, rules: string | string[]): boolean {
    const ruleList: string[] = typeof rules === 'string' ? [rules] : rules;
    const results: boolean[] = [];

    if (ruleList.includes('nullable') && data == null) {
      return true;
    }

    // if nullable rule enabled
    if ((ruleList.includes('nullable') && data === undefined) || (ruleList.includes('nullable') && data.length === 0)) {
      return true;
    }

    // TODO megcsinálni, hogy kitalálja a függvény a szabályt a típus alapján. Pl. BankAccountNumber - bankaacount

    ruleList.forEach((rule: string)  => {
      switch (rule) {
        case 'string':
          results.push(this.isString(data));
          break;
        case 'number':
          results.push(this.isNumber(data));
          break;
        case 'boolean':
          results.push(this.isBoolean(data));
          break;
        case 'integer':
          results.push(this.isInteger(data));
          break;
        case 'required':
          results.push(this.isRequired(data));
          break;
        case 'name':
          results.push(this.isName(data));
          break;
        case 'email':
          results.push(this.isEmail(data));
          break;
        case 'domain':
          results.push(this.isDomain(data));
          break;
        case 'url':
          results.push(this.isUrl(data));
          break;
        case 'iso_date':
          results.push(this.isIsoDate(data));
          break;
        case 'driving_licence':
          results.push(this.isDrivingLicence(data));
          break;
        case 'id_card_number':
          results.push(this.isIdCardNumber(data));
          break;
        case 'address_card_number':
          results.push(this.isAddressCardNumber(data));
          break;
        case 'phonenumber':
          results.push(this.isPhoneNumber(data));
          break;
        case 'bankaccount':
          results.push(this.isBankAccount(data));
          break;
        case 'taxnumber':
          results.push(this.isTaxNumber(data));
          break;
        case 'social_insurance_number':
          results.push(this.isSocialInsuranceNumber(data));
          break;
        case 'not_zero':
          results.push(this.isNotZero(data));
          break;
        case 'lang':
          results.push(this.isLang(data));
          break;
        case 'register_number':
          results.push(this.isregisterNumber(data));
          break;
        case 'array':
          results.push(this.isArray(data));
          break;
        case 'not_empty':
          results.push(this.isNotEmpty(data));
          break;
        case 'empty':
          results.push(this.isEmpty(data));
          break;
        case 'person_taxnumber':
          results.push(this.isPersonTaxNumber(data));
          break;
        case 'color_code':
          results.push(this.isColorCode(data));
          break;
        case 'nullable':
          // results.push(true);
          break;
        case 'iban_code':
          results.push(this.isIbanCode(data));
          break;
        case 'swift_code':
          results.push(this.isSwiftCode(data));
          break;

        // TODO min:N
        // TODO max:N

        default:
          results.push(false);
      }

    });

    return results.every(this.isTrue);
  }

  private isTrue(value: boolean): boolean {
    return value;
  }

  // TODO: befejezni
  min(data: any, minimum: number): boolean {
    if (data.length >= minimum) {
      return true;
    }
    return false;
  }

  // TODO: befejezni
  max(data: any, maximum: number): boolean {
    if (data.length <= maximum) {
      return true;
    }
    return false;
  }

  isRequired(data: any): boolean {
    if (data !== undefined && data !== null && data !== '' && data !== [] && data !== {}) {
      return true;
    }

    return false;
  }

  isNullable(data: any): boolean {
    return true;
  }

  isString(data: any): boolean {
    if (typeof data === 'string') {
      return true;
    }

    return false;
  }

  isBoolean(data: any): boolean {
    return data === true || data === false || data === null || data === 1 || data === 0;
  }

  isNumber(data: any): boolean {
    return !Number.isNaN(data);
  }

  isInteger(data: any): boolean {
    if (typeof data === 'number' && Number.isInteger(data)) {
      return true;
    }

    return false;
  }

  isNotZero(data: any): boolean {
    return data !== 0;
  }

  isregisterNumber(data: any): boolean {
    return this.registerNumberRegExp.test(data);
  }

  isLang(data: any): boolean {
    return this.langRegExp.test(data);
  }

  isName(data: any): boolean {
    return this.nameRegExp.test(data);
  }

  isEmail(data: any): boolean {
    return this.emailRegExp.test(data);
  }

  isDomain(data: any): boolean {
    return this.domainRegExp.test(data);
  }

  isUrl(data: any): boolean {
    return this.urlRegExp.test(data);
  }

  isIsoDate(data: any): boolean {
    return this.isoDateRegExp.test(data);
  }

  isDrivingLicence(data: any): boolean {
    return this.drivingLicenceRegExp.test(data);
  }

  isIdCardNumber(data: any): boolean {
    return this.idCardNumberRegExp.test(data);
  }

  isAddressCardNumber(data: any): boolean {
    return this.addressCardNumberRegExp.test(data);
  }

  isPhoneNumber(data: any): boolean {
    return this.phonenumberRegExp.test(data);
  }

  isBankAccount(data: any): boolean {
    return this.bankaccountRegExp.test(data);
  }

  isTaxNumber(data: any): boolean {
    return this.taxnumberRegExp.test(data);
  }

  isSocialInsuranceNumber(data: any): boolean {
    return this.socialInsuranceNumberRegExp.test(data);
  }

  isCreditCard(data: any): boolean {
    const results: boolean[] = [
      this.isCreditCardVisa(data),
      this.isCreditCardMastercard(data),
      this.isCreditCardAmericanExpress(data),
      this.isCreditCardDiscover(data)
    ];

    return results.includes(true);
  }

  isCreditCardVisa(data: any): boolean {
    return this.creditCardVisaRegExp.test(data);
  }

  isCreditCardMastercard(data: any): boolean {
    return this.creditCardMastercardRegExp.test(data);
  }

  isCreditCardAmericanExpress(data: any): boolean {
    return this.creditCardAmericanExpressRegExp.test(data);
  }

  isCreditCardDiscover(data: any): boolean {
    return this.creditCardDiscoverRegExp.test(data);
  }

  isArray(data: any): boolean {
    return data instanceof Array;
  }

  isEmpty(data: any): boolean {
    if (data !== undefined && data !== null) {
      return data.length === 0;
    }

    return false;

  }

  isNotEmpty(data: any): boolean {
    return data.length > 0;
  }

  isPersonTaxNumber(data: any): boolean {
    if (!data) {
      return false;
    }
    return this.personTaxNumberRegExp.test(data);
  }

  isColorCode(data: any): boolean {
    if (!data) {
      return false;
    }
    return this.colorCodeRegExp.test(data);
  }

  isIbanCode(data: any): boolean {
    return this.ibanCodeRegExp.test(data);
  }

  isSwiftCode(data: any): boolean {
    return this.swiftCodeRegExp.test(data);
  }
}
