import {LitElement} from 'lit';
import {AnyObject} from '@unicef-polymer/etools-types';

type ValidatableElement = LitElement & {
  validate(): boolean;
};

export const validateRequiredFields = (element: LitElement) => {
  let isValid = true;
  element!
    .shadowRoot!.querySelectorAll<ValidatableElement>('[required]:not([readonly]):not([hidden])')
    .forEach((el) => {
      if (el && el.validate && !el.validate()) {
        isValid = false;
      }
    });
  return isValid;
};

export const resetRequiredFields = (element: LitElement) => {
  element!.shadowRoot!.querySelectorAll<ValidatableElement>('[required]').forEach((el: AnyObject) => {
    if (el) {
      el.invalid = false;
    }
  });
};

export const fieldValidationReset = (element: LitElement, selector: string, useValidate?: boolean) => {
  if (!useValidate) {
    useValidate = false;
  }
  const field = element.shadowRoot!.querySelector(selector) as LitElement & {
    validate(): boolean;
  };
  if (field) {
    if (useValidate) {
      field.validate();
    } else {
      // TODO: check if sets to false
      field.setAttribute('invalid', 'false');
    }
  }
  return field;
};
