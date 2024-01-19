import { CurrentConditions } from './current-conditions/current-conditions.type';

export interface ConditionsAndZip {
  countryCode: string;
  zip: string;
  data: CurrentConditions;
}
