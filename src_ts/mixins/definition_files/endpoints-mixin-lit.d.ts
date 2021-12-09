import {EtoolsRequestEndpoint} from '@unicef-polymer/etools-ajax/etools-ajax-request';
import {AnyObject, Constructor, User} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit-element';
declare function EndpointsLitMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    prpCountries: AnyObject[];
    currentUser: User;
    endStateChanged(state: any): void;
    _getPrpCountryId(): any;
    _urlTemplateHasCountryId(template: string): boolean;
    getEndpoint(endpointsList: AnyObject, endpointName: string, data?: AnyObject | undefined): any;
    _generateUrlFromTemplate(tmpl: string, data: AnyObject | undefined): string;
    _hasUrlTemplate(endpoint: AnyObject): any;
    _getDeferrer(): any;
    authorizationTokenMustBeAdded(endpoint: AnyObject): boolean;
    getCurrentToken(tokenKey: string): string | null;
    storeToken(tokenKey: string, tokenBase64Encoded: string): void;
    decodeBase64Token(encodedToken: string): any;
    tokenIsValid(token: string): boolean;
    getAuthorizationHeader(token: string): {
      Authorization: string;
    };
    requestToken(endpoint: EtoolsRequestEndpoint): Promise<any>;
    _buildOptionsWithTokenHeader(options: any, token: string): any;
    getTokenEndpointName(tokenKey: string): any;
    addTokenToRequestOptions(endpointsCollection: AnyObject, endpointName: string, data: AnyObject): any;
    _addAdditionalRequestOptions(options: any, requestAdditionalOptions: any): any;
    fireRequest(
      endpointsCollection: AnyObject,
      endpoint: any,
      endpointTemplateData: AnyObject,
      requestAdditionalOptions?: AnyObject | undefined,
      activeReqKey?: string | undefined
    ): any;
  };
} & T;
export default EndpointsLitMixin;
