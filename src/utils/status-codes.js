export const statusCodes = {
  SUCCESS: 2000,
  INVALID_REQUEST: 2001,
  NO_RECORD_FOUND: 2002,
  UNAUTHORIZED: 2003,
  DUPLICATE: 2004,
  FAILURE: 2005,
  DATA_IN_USE: 2006,
  BAD_REQUEST: 2007,
  METHOD_NOT_ALLOWED: 2008,
  RESTRICTED_ACCESS: 2009,
  LIMIT_REACHED: 2010,
  NULL_ARGUMENT: 2011,
  NO_DATA_CHANGED: 2012,
  CONSTRAINT_VIOLATION: 2013,
  ATTACHMENT_REQUIRED: 2014,
  USER_NOT_FOUND: 2015
}

export const AdditionalStatusCodes = {
  404: 'No Data Found'
}

export function formatStatusCodes(code) {
  return code.toLowerCase().replace('_', '')
}

// NOTE -  request for token expired status code
