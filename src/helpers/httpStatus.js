export const HTTP_STATUS = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,

  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,

  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
  UNKNOWN_ERROR: 520,
  WEB_SERVER_IS_DOWN: 521,
  NETWORK_TIMEOUT_ERROR: 599,
};

export const STATUS_MESSAGE = {
  [HTTP_STATUS.CONTINUE]: 'Continue',
  [HTTP_STATUS.SWITCHING_PROTOCOLS]: 'Switching Protocols',
  [HTTP_STATUS.PROCESSING]: 'Processing',
  [HTTP_STATUS.EARLY_HINTS]: 'Early Hints',

  [HTTP_STATUS.OK]: 'OK',
  [HTTP_STATUS.CREATED]: 'Created',
  [HTTP_STATUS.ACCEPTED]: 'Accepted',
  [HTTP_STATUS.NON_AUTHORITATIVE_INFORMATION]: 'Non-Authoritative Information',
  [HTTP_STATUS.NO_CONTENT]: 'No Content',
  [HTTP_STATUS.RESET_CONTENT]: 'Reset Content',
  [HTTP_STATUS.PARTIAL_CONTENT]: 'Partial Content',
  [HTTP_STATUS.MULTI_STATUS]: 'Multi-Status',
  [HTTP_STATUS.ALREADY_REPORTED]: 'Already Reported',
  [HTTP_STATUS.IM_USED]: 'IM Used',

  [HTTP_STATUS.MULTIPLE_CHOICES]: 'Multiple Choices',
  [HTTP_STATUS.MOVED_PERMANENTLY]: 'Moved Permanently',
  [HTTP_STATUS.FOUND]: 'Found',
  [HTTP_STATUS.SEE_OTHER]: 'See Other',
  [HTTP_STATUS.NOT_MODIFIED]: 'Not Modified',
  [HTTP_STATUS.USE_PROXY]: 'Use Proxy',
  [HTTP_STATUS.TEMPORARY_REDIRECT]: 'Temporary Redirect',
  [HTTP_STATUS.PERMANENT_REDIRECT]: 'Permanent Redirect',

  [HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
  [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
  [HTTP_STATUS.PAYMENT_REQUIRED]: 'Payment Required',
  [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
  [HTTP_STATUS.NOT_FOUND]: 'Not Found',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HTTP_STATUS.NOT_ACCEPTABLE]: 'Not Acceptable',
  [HTTP_STATUS.PROXY_AUTHENTICATION_REQUIRED]: 'Proxy Authentication Required',
  [HTTP_STATUS.REQUEST_TIMEOUT]: 'Request Timeout',
  [HTTP_STATUS.CONFLICT]: 'Conflict',
  [HTTP_STATUS.GONE]: 'Gone',
  [HTTP_STATUS.LENGTH_REQUIRED]: 'Length Required',
  [HTTP_STATUS.PRECONDITION_FAILED]: 'Precondition Failed',
  [HTTP_STATUS.CONTENT_TOO_LARGE]: 'Content Too Large',
  [HTTP_STATUS.URI_TOO_LONG]: 'URI Too Long',
  [HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type',
  [HTTP_STATUS.RANGE_NOT_SATISFIABLE]: 'Range Not Satisfiable',
  [HTTP_STATUS.EXPECTATION_FAILED]: 'Expectation Failed',
  [HTTP_STATUS.IM_A_TEAPOT]: 'I\'m a teapot',
  [HTTP_STATUS.MISDIRECTED_REQUEST]: 'Misdirected Request',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HTTP_STATUS.LOCKED]: 'Locked',
  [HTTP_STATUS.FAILED_DEPENDENCY]: 'Failed Dependency',
  [HTTP_STATUS.TOO_EARLY]: 'Too Early',
  [HTTP_STATUS.UPGRADE_REQUIRED]: 'Upgrade Required',
  [HTTP_STATUS.PRECONDITION_REQUIRED]: 'Precondition Required',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HTTP_STATUS.REQUEST_HEADER_FIELDS_TOO_LARGE]: 'Request Header Fields Too Large',

  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HTTP_STATUS.NOT_IMPLEMENTED]: 'Not Implemented',
  [HTTP_STATUS.BAD_GATEWAY]: 'Bad Gateway',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Gateway Timeout',
  [HTTP_STATUS.HTTP_VERSION_NOT_SUPPORTED]: 'HTTP Version Not Supported',
  [HTTP_STATUS.VARIANT_ALSO_NEGOTIATES]: 'Variant Also Negotiates',
  [HTTP_STATUS.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
  [HTTP_STATUS.LOOP_DETECTED]: 'Loop Detected',
  [HTTP_STATUS.NOT_EXTENDED]: 'Not Extended',
  [HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED]: 'Network Authentication Required',
  [HTTP_STATUS.UNKNOWN_ERROR]: 'Unknown error. Data retrieval failed. Check bookmarks manually; data may be incomplete.',
  [HTTP_STATUS.WEB_SERVER_IS_DOWN]: ' Web server is down',
  [HTTP_STATUS.NETWORK_TIMEOUT_ERROR]: 'Network Timeout Error',
};

export const getStatusMessage = (status) => STATUS_MESSAGE[status] || 'Unknown Status';
