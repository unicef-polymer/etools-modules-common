import { AnyObject, Constructor } from '@unicef-polymer/etools-types';
declare function CommonMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    /**
     * Prepare and return the string value we have to display on the interface.
     * Ex: partners and agreements lists data values.
     */
    getDisplayValue(
      value: any,
      separator: string,
      skipSpaces: boolean
    ): string | number;
    /**
     * Prepare date string and return it in a user readable format
     */
    getDateDisplayValue(dateString: string): any;
    prepareEtoolsFileDataFromUrl(fileUrl: string): AnyObject[];
    getFileNameFromURL(url: string): string | undefined;
    _translate(textKey: string): string;
  };
} & T;
export default CommonMixin;
