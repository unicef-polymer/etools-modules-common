const DOMAINS = {
  STAGING: 'etools-staging.unicef.org',
  DEV: 'etools-dev.unicef.org',
  DEMO: 'etools-demo.unicef.org',
  TEST: 'etools-test.unicef.io',
  LOCAL: 'localhost:8082',
  PROD: 'etools.unicef.org'
};

const getBasePath = () => {
  console.log(document.getElementsByTagName('base')[0].href);
  return document.getElementsByTagName('base')[0].href;
};

export const tokenStorageKeys = {
  prp: 'etoolsPrpToken'
};

export const getTokenEndpoints = {
  prp: 'prpToken'
};

export const ROOT_PATH = '/' + getBasePath().replace(window.location.origin, '').slice(1, -1) + '/';

export const _checkEnvironment = () => {
  const location = window.location.href;
  if (location.indexOf(DOMAINS.STAGING) > -1) {
    return 'STAGING';
  }
  if (location.indexOf(DOMAINS.DEMO) > -1) {
    return 'DEMO';
  }
  if (location.indexOf(DOMAINS.TEST) > -1) {
    return 'TEST';
  }
  if (location.indexOf(DOMAINS.DEV) > -1) {
    return 'DEVELOPMENT';
  }
  if (location.indexOf(DOMAINS.LOCAL) > -1) {
    return 'LOCAL';
  }
  if (location.indexOf(DOMAINS.PROD) > -1) {
    return 'PROD';
  }
  return null;
};

export const tokenEndpointsHost = (host: string) => {
  if (host === 'prp') {
    switch (_checkEnvironment()) {
      case 'LOCAL':
        return 'http://prp.localhost:8081';
      case 'DEVELOPMENT':
        return 'https://dev.partnerreportingportal.org';
      case 'TEST':
        return 'https://dev.partnerreportingportal.org';
      case 'DEMO':
        return 'https://demo.partnerreportingportal.org';
      case 'STAGING':
        return 'https://staging.partnerreportingportal.org';
      case 'PROD':
        return 'https://www.partnerreportingportal.org';
      default:
        return 'https://dev.partnerreportingportal.org';
    }
  }
  return null;
};
