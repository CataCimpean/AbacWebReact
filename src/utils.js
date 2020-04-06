import { PLANET_STATUS, STATUS_INPUT_LENGTH } from './constants';
const { OK, NOT_OK, EN_ROUTE } = PLANET_STATUS;
// TODO: refactor this function,to be more general and extract in a utils
export const applyStatusClass = statusText => {
  if (!statusText) return;

  let status = statusText.toLowerCase();

  switch (status) {
    case OK:
      return 'ok';
    case NOT_OK:
      return 'not-ok';
    case EN_ROUTE:
      return 'en-route';
    default:
      return '';
  }
};

export const validateInput = input => {
  let isValid = true;
  let errMsg = null;
  // TODO: refactor this if
  if (input.toLowerCase() === OK || input.toLowerCase() === NOT_OK || input.toLowerCase() === EN_ROUTE) {
    isValid = true;
    errMsg = null;
  } else if (input.length > STATUS_INPUT_LENGTH) {
    isValid = false;
    errMsg = 'Status too long';
  } else {
    isValid = false;
    errMsg = 'Error status unknown';
  }

  return { isValid, errMsg };
};

export const basicFetch = (endpoint, options) => fetch(endpoint, options);
