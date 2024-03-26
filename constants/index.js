/**
 * Format full date
 */
export const FORMAT_DATE_FULL = 'YYYY-MM-DD'

/**
 * Format full date time
 */
export const FORMAT_DATE_TIME_FULL = 'YYYY-MM-DD HH:mm:ss'

export const FORMAT_DATE_TIME = 'DD/MM/YYYY HH:mm'

/**
 * Format time
 */
export const FORMAT_TIME = 'HH:mm'

/**
 * Time zone
 */
export const DEFAULT_TIMEZONE = 'Asia/Tokyo'

/**
 * Language
 */
export const DEFAULT_LANGUAGE = 'ja-JP'

/**
 * Status
 */
export const STATUS = {
  ja: [
    { label: '開ける', value: 0 },
    { label: '近い', value: 1 }
  ],
  en: [
    { label: 'Open', value: 0 },
    { label: 'Closed', value: 1 }
  ],
  vi: [
    { label: 'Mở', value: 0 },
    { label: 'Đóng', value: 1 }
  ]
}

export const DEFAULT_TITLE = 'Digidinos'

export const ENV_STATUS_VALUE = {
  use: 0,
  not_use: 1
}

/**
 * Event test case status
 */
export const EVN_TEST_CASE_STATUS = {
  ja: [
    { label: '使用しない', value: 1 },
    { label: '使用中で', value: 0 }
  ],
  en: [
    { label: 'Not Use', value: 1 },
    { label: 'In Use', value: 0 }
  ],
  vi: [
    { label: 'Không sử dụng', value: 1 },
    { label: 'Có sử dụng', value: 0 }
  ]
}

/*
 * Use Flag
 */
export const USE_FLG = {
  ja: [
    { label: 'いいえ', value: 0 },
    { label: 'はい', value: 1 }
  ],
  en: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
  ],
  vi: [
    { label: 'Không', value: 0 },
    { label: 'Có', value: 1 }
  ]
}

export const USE_FLG_VALUE = { yes: 1, no: 0 }

export const STATUS_VALUE = { close: 1, open: 0 }

export const RESULT_FLG = { unchecked: 0, na: 1, pass: 2, not_pass: 3 }

export const FLG_QA = { yes: 1, no: 0 }

/**
 * Locl flg
 */
export const LOCL_FLG = {
  ja: [
    { label: 'いいえ', value: 0 },
    { label: 'はい', value: 1 }
  ],
  en: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
  ],
  vi: [
    { label: 'Không', value: 0 },
    { label: 'Có', value: 1 }
  ]
}
export const LOCK_FLG_VALUE = { yes: 1, no: 0 }

export const EVENT_TYPE = {
  ja: [
    { label: '関数', value: 0 },
    { label: 'アイテム', value: 1 }
  ],
  en: [
    { label: 'Function', value: 0 },
    { label: 'Item', value: 1 }
  ],
  vi: [
    { label: 'Chức năng', value: 0 },
    { label: 'Hạng mục', value: 1 }
  ]
}

/**
 * Default
 */
export const DEFAULT = {
  ja: [
    { label: 'いいえ', value: 0 },
    { label: 'はい', value: 1 }
  ],
  en: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
  ],
  vi: [
    { label: 'Không', value: 0 },
    { label: 'Có', value: 1 }
  ]
}

export const REQUIRED = {
  ja: [
    { label: 'いいえ', value: 0 },
    { label: 'はい', value: 1 }
  ],
  en: [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
  ],
  vi: [
    { label: 'Không', value: 0 },
    { label: 'Có', value: 1 }
  ]
}

export const TYPE_VALUE = {
  ja: [
    { label: '文章', value: 0 },
    { label: '番号', value: 1 },
    { label: 'Boolean', value: 2 },
    { label: '他の', value: 3 }
  ],
  en: [
    { label: 'Text', value: 0 },
    { label: 'Number', value: 1 },
    { label: 'Boolean', value: 2 },
    { label: 'Other', value: 3 }
  ],
  vi: [
    { label: 'Text', value: 0 },
    { label: 'Số', value: 1 },
    { label: 'Boolean', value: 2 },
    { label: 'Khác', value: 3 }
  ]
}

export const REQUIRED_VALUE = { yes: 1, no: 0 }

export const TYPE_VALUE_SELECT_DEFAULT = 0

export const EVENT_TYPE_DEFAULT = 1

export const ERROR_CODE = {
  PRJ_HAS_FUNCTION_ITEM: 452,
  EVENT_EXISTS: 450,
  VERSION_UNLOCK: 456,
  EXIST_ENTITY_NAME: 458,
  END_DATE_INVALID: 459,
  NO_APPROVER: 460,
  CUSTOMER_SERVICE_STAFF: 461,
  YOU_ARE_SYNCING: 410,
  TREE_IS_BEING_SYNCHRONIZED: 412
}

/**
 * API root url.
 */
export const API_ROOT_URL = process.env.API_ROOT_URL
export const API_BASE_URL = process.env.API_BASE_URL
export const EJ2_LICENSE_KEY = process.env.EJ2_LICENSE_KEY

/**
 * Logic type.
 */
export const LOGIC_TYPE_SELECT = [
  { label: 'Tuần tự', value: 0 },
  { label: 'Goto', value: 1 },
  { label: 'If', value: 2 }
]

export const LOGIC_TYPE = [
  { label: 'Tuần tự', value: 0 },
  { label: 'Goto', value: 1 },
  { label: 'If', value: 2 },
  { label: 'Elseif', value: 3 },
  { label: 'Else', value: 4 }
]

export const LOGIC_TYPE_VALUE = {
  sequence: 0,
  goto: 1,
  if: 2,
  elseif: 3,
  else: 4
}

export const SORT = {
  desc: 0,
  asc: 1
}

export const MST_ITEM_TYPE = {
  boolean: 2
}

export const BOOLEAN_TYPE = {
  ja: [
    { label: 'いいえ', value: 'false' },
    { label: 'はい', value: 'true' }
  ],
  en: [
    { label: 'No', value: 'false' },
    { label: 'Yes', value: 'true' }
  ],
  vi: [
    { label: 'Không', value: 'false' },
    { label: 'Có', value: 'true' }
  ]
}

/**
 * Category test case status
 */
export const CATEGORY_TEST_CASE_STATUS = {
  ja: [
    { label: '使用しない', value: 0 },
    { label: '使用中で', value: 1 }
  ],
  en: [
    { label: 'Not Use', value: 0 },
    { label: 'In Use', value: 1 }
  ],
  vi: [
    { label: 'Không sử dụng', value: 0 },
    { label: 'Có sử dụng', value: 1 }
  ]
}

export const CATEGORY_TEST_CASE_STATUS_VALUE = {
  not_use: 0,
  use: 1
}

export const BUG_TYPE_STATUS = {
  ja: [
    { label: '使用しない', value: 0 },
    { label: '使用中で', value: 1 }
  ],
  en: [
    { label: 'Not Use', value: 0 },
    { label: 'In Use', value: 1 }
  ],
  vi: [
    { label: 'Không sử dụng', value: 0 },
    { label: 'Có sử dụng', value: 1 }
  ]
}

export const BUG_TYPE_STATUS_VALUE = {
  not_use: 0,
  use: 1
}

export const TEST_CASE_STATUS = {
  ja: [
    { label: '使用しない', value: 0 },
    { label: '使用中で', value: 1 }
  ],
  en: [
    { label: 'Not Use', value: 0 },
    { label: 'In Use', value: 1 }
  ],
  vi: [
    { label: 'Không sử dụng', value: 0 },
    { label: 'Có sử dụng', value: 1 }
  ]
}

export const TYPE_ACTION = [
  { label: 'Select', value: 0 },
  { label: 'Insert or Update', value: 1 },
  { label: 'Insert', value: 2 },
  { label: 'Update', value: 3 },
  { label: 'Delete', value: 4 },
  { label: 'Where', value: 5 },
  { label: 'Order by', value: 6 },
  { label: 'Group by', value: 7 },
  { label: 'Having', value: 8 },
  { label: 'Like', value: 9 },
  { label: 'In', value: 10 }
]

export const TEST_CASE_STATUS_VALUE = {
  not_use: 0,
  use: 1
}

export const DATA_TYPE_VALUE = {
  integer: 1,
  long: 2,
  float: 3,
  double: 4,
  string: 5,
  byte: 6,
  binary: 7,
  boolean: 8,
  date: 9,
  dateTime: 10,
  password: 11,
  object: 12,
  array: 13,
  null: 14
}

export const DATA_TYPE = [
  { label: 'Integer', value: 1 },
  { label: 'Long', value: 2 },
  { label: 'Float', value: 3 },
  { label: 'Double', value: 4 },
  { label: 'String', value: 5 },
  { label: 'Byte', value: 6 },
  { label: 'Binary', value: 7 },
  { label: 'Boolean', value: 8 },
  { label: 'Date', value: 9 },
  { label: 'DateTime', value: 10 },
  { label: 'Password', value: 11 },
  { label: 'Object', value: 12 },
  { label: 'Array', value: 13 },
  { label: 'Null', value: 14 }
]

export const COLUMN_DATA_TYPE = [
  { label: 'Tinyint', value: 1 },
  { label: 'Smallint', value: 2 },
  { label: 'Mediumint', value: 3 },
  { label: 'Int', value: 4 },
  { label: 'Bigint', value: 5 },
  { label: 'Float', value: 6 },
  { label: 'Double', value: 7 },
  { label: 'Decimal', value: 8 },
  { label: 'Char', value: 9 },
  { label: 'Varchar', value: 10 },
  { label: 'Tinytext', value: 11 },
  { label: 'Text', value: 12 },
  { label: 'Blob', value: 13 },
  { label: 'Mediumtext', value: 14 },
  { label: 'Mediumblob', value: 15 },
  { label: 'Longtext', value: 16 },
  { label: 'Longblob', value: 17 },
  { label: 'Date', value: 18 },
  { label: 'Datetime', value: 19 },
  { label: 'Timestamp', value: 20 },
  { label: 'Time', value: 21 },
  { label: 'Enum', value: 22 },
  { label: 'Set', value: 23 },
  { label: 'Boolean', value: 24 }
]

export const COLUMN_DATA_TYPE_VALUE = {
  1: 'tinyint',
  2: 'smallint',
  3: 'mediumint',
  4: 'int',
  5: 'bigint',
  6: 'float',
  7: 'double',
  8: 'decimal',
  9: 'char',
  10: 'varchar',
  11: 'tinytext',
  12: 'text',
  13: 'blob',
  14: 'mediumtext',
  15: 'mediumblob',
  16: 'longtext',
  17: 'longblob',
  18: 'date',
  19: 'datetime',
  20: 'timestamp',
  21: 'time',
  22: 'enum',
  23: 'set',
  24: 'boolean'
}

export const DB_COLUMN_PRIMARY_KEY_VALUE = {
  yes: 1,
  no: 0
}

export const DB_COLUMN_PRIMARY_KEY = [
  { label: 'Không', value: 0 },
  { label: 'Có', value: 1 }
]

export const DB_COLUMN_AUTO_INCREMENT_VALUE = {
  yes: 1,
  no: 0
}

export const DB_COLUMN_AUTO_INCREMENT = [
  { label: 'Không', value: 0 },
  { label: 'Có', value: 1 }
]

export const DB_COLUMN_NOT_NULL_VALUE = {
  yes: 1,
  no: 0
}

export const DB_COLUMN_NOT_NULL = [
  { label: 'Không', value: 0 },
  { label: 'Có', value: 1 }
]

export const REGEX_NUMBER_ONLY = /^[1-9]\d*$/

export const MST_TEST_CASE_VALIDATION_STATUS = {
  ja: [
    { label: '使用しない', value: 0 },
    { label: '使用中で', value: 1 }
  ],
  en: [
    { label: 'Not Use', value: 0 },
    { label: 'In Use', value: 1 }
  ],
  vi: [
    { label: 'Không sử dụng', value: 0 },
    { label: 'Có sử dụng', value: 1 }
  ]
}

export const MST_TEST_CASE_VALIDATION_STATUS_VALUE = {
  not_use: 0,
  use: 1
}

export const AUTO_LOGIC_TYPE_NOT_IN = ['data view', 'label']

export const USER_MODULE = ['user', 'kpi', 'groupMember']

export const ROLE_MODULE = ['role']

export const PROJECT_MODULE = [
  'project',
  'functionEtPoint',
  'projectEtPoint',
  'groupMember',
  'supportMember',
  'checklist',
  'requirement',
  'replyRequirement',
  'requirementEstimate',
  'requirementFunction',
  'requirementFunctionEvent',
  'requirementFunctionItem'
]

export const SETTINGS_MODULE = [
  'mstItemType',
  'mstItemProperty',
  'mstValidation',
  'mstTestcaseValidation',
  'mstEvent',
  'mstEvnTestCase',
  'mstCategoryTestCaseCommon',
  'mstTestCaseCommon',
  'mstLifeCycle',
  'mstLifeCycleStatus',
  'mstBugType',
  'testCaseInput',
  'testCaseOutput',
  'caseTest'
]

export const BASIC_DESIGN_MODULE = [
  'category',
  'function',
  'functionEvent',
  'functionEventLogical',
  'functionImage',
  'functionItem',
  'functionItemProperty',
  'functionItemReadDatasource',
  'functionItemValidation',
  'functionItemWriteDatasource',
  'functionTestCase',
  'versionFunction',
  'flow',
  'flowHistory',
  'functionMessage',
  'flowFile',
  'functionRelationship',
  'functionRelationshipItem',
  'question',
  'functionSequenceDiagram',
  'answer',
  'component',
  'componentFunctionMapping',
  'componentItem',
  'componentItemFunction',
  'componentData',
  'componentProp',
  'componentFunction',
  'componentEvent',
  'componentEventFunction',
  'componentEmit',
  'componentStore',
  'componentChild',
  'componentChildProp',
  'componentChildEmit',
  'functionUsecase',
  'functionUsecaseAction',
  'file'
]

export const TEST_MODULE = [
  'functionResult',
  'functionResultDetail',
  'bug',
  'bugFile',
  'bugNote',
  'testcaseGroup',
  'testcaseInputResult',
  'testcaseMatrix',
  'testcaseMatrixInput',
  'testcaseMatrixOutput',
  'testcaseNumber',
  'testcaseOutputResult',
  'testcaseOutputResultDetail'
]

export const API_MODULE = [
  'api',
  'apiCategory',
  'apiInfo',
  'apiParameter',
  'apiParameterDatasource',
  'apiResponse',
  'apiResponseDatasource',
  'versionApi',
  'apiSequenceDiagram'
]

export const DB_MODULE = [
  'dbSchema',
  'dbTable',
  'dbTableColumn',
  'dbTableVersion',
  'entity',
  'entityRelationship',
  'entityHistory',
  'erGroup'
]

export const BA_MODULE = ['action', 'actorAction', 'actor']

export const SOURCE_CODE_MODULE = ['sourceCode', 'branch', 'model', 'modelProperty', 'tree']

export const LIFE_CYCLE_STATUS_CLOSED = [
  { label: 'Bình thường', value: 0 },
  { label: 'Closed', value: 1 },
  { label: 'Không cần xử lý', value: 2 }
]

export const LIFE_CYCLE_STATUS_CLOSED_VALUE = {
  no_handle: 2,
  closed: 1,
  normal: 0
}

export const LIFE_CYCLE_STATUS_DEFAULT = [
  { label: 'Không', value: 0 },
  { label: 'Có', value: 1 }
]

export const LIFE_CYCLE_STATUS_DEFAULT_VALUE = {
  yes: 1,
  no: 0
}

export const ENTITY_RELATION = [
  { label: 'Zero or one', value: 0 },
  { label: 'Exactly one', value: 1 },
  { label: 'Zero or more', value: 2 },
  { label: 'One or more', value: 3 }
]

export const ENTITY_RELATION_VALUE = {
  zero_or_one: 0,
  exactly_one: 1,
  zero_or_more: 2,
  one_or_more: 3
}

export const ENTITY_RELATION_1_SYMBOLS = {
  0: '|o',
  1: '||',
  2: '}o',
  3: '}|'
}

export const ENTITY_RELATION_2_SYMBOLS = {
  0: 'o|',
  1: '||',
  2: 'o{',
  3: '|{'
}

export const ENTITY_RELATION_TYPE = [
  { label: '--', value: 0 },
  { label: '..', value: 1 }
]

export const ENTITY_RELATION_TYPE_VALUE = {
  0: '--',
  1: '..'
}

export const FLOW_HISTORY_TYPE = {
  flow: 0,
  flowFile: 1
}

export const ENTITY_HISTORY_TYPE_VALUE = {
  0: 'Thêm',
  1: 'Sửa',
  2: 'Xóa'
}

export const ENTITY_HISTORY_TYPE = [
  { label: 'Thêm', value: 0 },
  { label: 'Sửa', value: 1 },
  { label: 'Xóa', value: 2 }
]

export const APPROVE = {
  no: 0,
  yes: 1
}

export const APPROVE_ET = {
  no: 0,
  yes: 1
}

export const FLG_ADD_POINT = {
  yes: 1,
  no: 0
}

export const TASK_TYPE = [
  { label: 'Task dự án', value: 0 },
  { label: 'Họp dự án', value: 1 }
]

export const TASK_TYPE_VALUE = {
  project: 0,
  meeting: 1
}

export const TASK_STATUS = [
  { label: 'Chưa thực hiện', value: 0 },
  { label: 'Đang thực hiện', value: 1 },
  { label: 'Yêu cầu thực hiện lại', value: 2 },
  { label: 'Đã báo cáo hoàn thành công việc', value: 3 },
  { label: 'Hoàn thành và được ghi nhận POINT', value: 4 },
  { label: 'Tạm dừng', value: 5 }
]

export const TASK_STATUS_CHART = [
  { label: 'New', value: 0 },
  { label: 'In progress', value: 1 },
  { label: 'Re progress', value: 2 },
  { label: 'Resolved', value: 3 },
  { label: 'Done', value: 4 },
  { label: 'Pending', value: 5 },
  { label: 'Cancel', value: 6 }
]
export const TASK_APPROVE_ET_STATUS = [
  { label: 'Chưa phê duyệt', value: 0 },
  { label: 'Phê duyệt đồng ý', value: 1 },
  { label: 'Phê duyệt không đồng ý', value: 2 }
]

export const TASK_APPROVE_STATUS = [
  { label: 'Chưa phê duyệt', value: 0 },
  { label: 'Đang phê duyệt', value: 1 },
  { label: 'Phê duyệt hoàn thành task', value: 2 },
  { label: 'Phê duyệt không hoàn thành task', value: 3 }
]

export const TASK_STATUS_VALUE = {
  new: 0,
  in_progress: 1,
  re_progress: 2,
  resolved: 3,
  done: 4,
  pending: 5,
  cancel: 6
}

export const TASK_STATUS_OPTION = {
  0: 'New',
  1: 'In progress',
  2: 'Re progress',
  3: 'Resolved',
  4: 'Done',
  5: 'Pending'
}

export const TASK_APPROVE_STATUS_VALUE = {
  not_approve: 0,
  approving: 1,
  approved: 2,
  unapproved: 3
}

export const DEFAULT_KPI = 1

export const CKEDITOR_TOOLBAR_SETTING = [
  'Undo',
  'Redo',
  '|',
  'Heading',
  '|',
  'Bold',
  'Italic',
  '|',
  'Link',
  'uploadImage',
  'insertTable',
  '|',
  'BulletedList',
  'NumberedList',
  'todoList',
  '|',
  'fontSize',
  'fontFamily',
  'fontColor',
  'fontBackgroundColor',
  '|',
  'Outdent',
  'Indent',
  'alignment',
  '|',
  'Blockquote'
]

export const CKEDITOR_IMAGE_SETTING = {
  resizeUnit: '%',
  resizeOptions: [
    {
      name: 'imageResize:original',
      label: 'Original',
      value: null
    },
    {
      name: 'imageResize:25',
      label: '25%',
      value: '25'
    },
    {
      name: 'imageResize:50',
      label: '50%',
      value: '50'
    },
    {
      name: 'imageResize:75',
      label: '75%',
      value: '75'
    }
  ]
}

export const POINT_HISTORY_ACTION_TYPE = [
  { label: 'Hoàn thành task dự án', value: '0' },
  { label: 'Hỗ trợ', value: '1' },
  { label: 'Phạt', value: '2' },
  { label: 'Điều chỉnh POINT', value: '3' },
  { label: 'Review task', value: '4' }
]

export const CHECK_LIST_RESULT = [
  { label: 'N/A', value: 0 },
  { label: 'Pass', value: 1 },
  { label: 'Fail', value: 2 }
]

export const CHECK_LIST_RESULT_VALUE = {
  na: 0,
  pass: 1,
  fail: 2
}

export const LIST_ROOT_TYPE = [
  {
    value: 1,
    label: 'backend'
  },
  {
    value: 2,
    label: 'frontend'
  }
]

export const LIST_PROPERTIES_TYPE = [
  {
    value: 0,
    label: 'function'
  },
  {
    value: 1,
    label: 'variable'
  }
]
export const LANGUAGE_PROJECT = [
  {
    id: 1,
    label: 'PHP'
  },
  {
    id: 2,
    label: 'JAVA'
  },
  {
    id: 3,
    label: 'JAVASCRIPT'
  }
]

export const CHANGE_FOLDER = 1
export const CHANGE_CLASS = 2
export const CHANGE_FUNCTION_PROPERTIES = 3

export const GROUP_TEST_CASE = [
  {
    id: 1,
    label: 'Di chuyển màn hình'
  },
  {
    id: 2,
    label: 'Giao diện chung'
  },
  {
    id: 3,
    label: 'Validate'
  },
  {
    id: 4,
    label: 'Chức năng'
  }
]

export const CHECK_MATRIX_INPUT = [
  {
    id: 1,
    label: '○'
  },
  {
    id: 2,
    label: '-'
  },
  {
    id: 3,
    label: '×'
  }
]

export const CHECK_MATRIX_INPUT_VALUE = {
  1: '○',
  2: '-',
  3: '×'
}

export const CHECK_MATRIX_OUTPUT = [
  {
    id: 1,
    label: '●'
  },
  {
    id: 2,
    label: '-'
  }
]

export const CHECK_MATRIX_OUTPUT_VALUE = {
  1: '●',
  2: '-'
}

export const EVIDENCE_TYPE = [
  {
    label: 'Không cần thiết',
    value: 1
  },
  {
    label: 'Capture màn hình',
    value: 2
  },
  {
    label: 'Trạng thái DB',
    value: 3
  },
  {
    label: 'Capture màn hình và Trạng thái DB',
    value: 4
  }
]

export const EVIDENCE_TYPE_VALUE = {
  1: 'Không cần thiết',
  2: 'Capture màn hình',
  3: 'Trạng thái DB',
  4: 'Capture màn hình và Trạng thái DB'
}

export const TESTCASE_DETAIL_JUDGEMENT = [
  {
    label: 'P',
    value: 1
  },
  {
    label: 'F',
    value: 2
  },
  {
    label: 'PE',
    value: 3
  },
  {
    label: '-',
    value: 4
  }
]

export const TESTCASE_DETAIL_JUDGEMENT_VALUE = {
  1: 'P',
  2: 'F',
  3: 'PE',
  4: '-'
}

export const TESTCASE_DETAIL_JUDGEMENT_VALUE_DATA = {
  pass: 1,
  fail: 2,
  pending: 3,
  na: 4
}

export const TESTCASE_DETAIL_JUDGEMENT_VALUE_COLOR_CLASS = {
  1: 'pass',
  2: 'false',
  3: 'pe',
  4: 'none'
}

export const GROUP_TEST_CASE_VALUE = {
  load_screen: 1,
  common_ui: 2,
  validate: 3,
  function: 4
}

export const GROUP_TEST_CASE_NAME = {
  1: 'di chuyển màn hình',
  2: 'giao diện chung',
  3: 'validate',
  4: 'chức năng'
}

export const PROPERTY_TYPE_VALUE = {
  function: 0,
  variable: 1
}

export const FLG_RELATED = [
  {
    label: 'X',
    value: 0
  },
  {
    label: 'O',
    value: 1
  }
]

export const STATUS_RELATIONSHIP = [
  {
    label: 'Không cần Q&A',
    value: 0
  },
  {
    label: 'Cần Q&A',
    value: 1
  },
  {
    label: 'DONE',
    value: 2
  }
]

export const STATUS_RELATIONSHIP_VALUE = {
  no_need_qa: 0,
  need_qa: 1,
  done: 2
}

export const CATEGORY_QUESTION = [
  {
    value: 1,
    label: 'Thông tin về hạng mục, giao diện'
  },
  {
    value: 2,
    label: 'Logic xử lý'
  },
  {
    value: 3,
    label: 'Quan hệ dữ liệu'
  },
  {
    value: 4,
    label: 'Frontend'
  },
  {
    value: 5,
    label: 'API'
  },
  {
    value: 6,
    label: 'DB'
  },
  {
    value: 8,
    label: 'Vấn đề tồn đọng, cần xử lý'
  },
  {
    value: 7,
    label: 'Khác'
  }
]

export const STATUS_QUESTION = [
  {
    value: 0,
    label: 'New'
  },
  {
    value: 1,
    label: 'Đã hỏi KH'
  },
  {
    value: 2,
    label: 'KH đã trả lời'
  },
  {
    value: 3,
    label: 'Xác nhận KH trả lời OK'
  }
]

export const STATUS_QUESTION_VALUE = {
  new: 0,
  asked: 1,
  replied: 2,
  confirm: 3
}

export const CATEGORY_QUESTION_VALUE = {
  info_item: 1,
  logic: 2,
  relationships: 3,
  frontend: 4,
  api: 5,
  db: 6,
  other: 7
}

// Event
export const Event = [
  {
    value: 1,
    label: 'Change'
  },
  {
    value: 2,
    label: 'Click'
  },
  {
    value: 3,
    label: 'Blur'
  },
  {
    value: 4,
    label: 'Input'
  },
  {
    value: 5,
    label: 'Submit'
  },
  {
    value: 6,
    label: 'fullscreenerror'
  },
  {
    value: 7,
    label: 'fullscreenchange'
  },
  {
    value: 8,
    label: 'error'
  },
  {
    value: 9,
    label: 'ended'
  },
  {
    value: 10,
    label: 'drag'
  },
  {
    value: 11,
    label: 'canplay'
  },
  {
    value: 12,
    label: 'touchmove'
  },
  {
    value: 13,
    label: 'touchend'
  },
  {
    value: 14,
    label: 'scroll'
  },
  {
    value: 15,
    label: 'resize'
  },
  {
    value: 16,
    label: 'playing'
  },
  {
    value: 17,
    label: 'play'
  },
  {
    value: 18,
    label: 'pause'
  },
  {
    value: 19,
    label: 'loadeddata'
  },
  {
    value: 20,
    label: 'online'
  },
  {
    value: 21,
    label: 'offline'
  },
  {
    value: 22,
    label: 'mouseleave'
  },
  {
    value: 23,
    label: 'mouseenter'
  },
  {
    value: 24,
    label: 'mousedown'
  },
  {
    value: 25,
    label: 'keyup'
  },
  {
    value: 26,
    label: 'dblclick'
  },
  {
    value: 27,
    label: 'keypress'
  },
  {
    value: 28,
    label: 'keydown'
  },
  {
    value: 29,
    label: 'focusout'
  },
  {
    value: 30,
    label: 'focusin'
  }
]

// Type model
export const TYPE_MODEL = [
  {
    value: 1,
    label: 'String'
  },
  {
    value: 2,
    label: 'Number'
  },
  {
    value: 3,
    label: 'Boolean'
  },
  {
    value: 4,
    label: 'Array'
  },
  {
    value: 5,
    label: 'Object'
  }
]

export const OUTPUT_DETAIL_TYPE_VALUE = {
  result: 1,
  judgement: 2,
  executed_date: 3,
  executor: 4,
  bug: 5
}

export const TYPE_SOURCE_CODE = [
  {
    label: 'FE',
    value: 2
  },
  {
    label: 'BE',
    value: 1
  }
]

export const EVENT_COMPONENT = {
  functionItems: 'functionItems',
  datum: 'datum',
  props: 'props',
  functions: 'functions',
  componentChilds: 'componentChilds',
  componentEmits: 'componentEmits',
  componentEvents: 'componentEvents',
  componentStores: 'componentStores'
}

export const BUG_STATUS = [
  { label: 'New', value: 0 },
  { label: 'In progress', value: 1 },
  { label: 'Resolved', value: 2 },
  { label: 'Testing', value: 3 },
  { label: 'Done', value: 4 },
  { label: 'Feedback', value: 5 },
  { label: 'Reject', value: 6 },
  { label: 'Deleted', value: 7 },
  { label: 'Released Dev', value: 8 },
  { label: 'Waiting4Staging', value: 9 },
  { label: 'Released Staging', value: 10 },
  { label: 'Waiting4Product', value: 11 },
  { label: 'Released Product', value: 12 },
  { label: 'Closed', value: 13 }
]

export const BUG_STATUS_VALUE = {
  new: 0,
  in_progress: 1,
  resolved: 2,
  testing: 3,
  done: 4,
  feedback: 5,
  reject: 6,
  deleted: 7,
  released_dev: 8,
  waiting_for_staging: 9,
  released_staging: 10,
  waiting_for_product: 11,
  released_product: 12,
  closed: 13
}

export const BUG_STATUS_INDEX = {
  0: 'New',
  1: 'In Progress',
  2: 'Resolved',
  3: 'Testing',
  4: 'Done',
  5: 'Feedback',
  6: 'Reject',
  7: 'Deleted',
  8: 'Released Dev',
  9: 'Waiting4Staging',
  10: 'Released Staging',
  11: 'Waiting4Product',
  12: 'Released Product',
  13: 'Closed'
}

export const BUG_PRIORITY = [
  { label: 'Low', value: 1 },
  { label: 'Normal', value: 2 },
  { label: 'High', value: 3 },
  { label: 'Urgent', value: 4 },
  { label: 'Immediate', value: 5 }
]

export const BUG_PRIORITY_VALUE = {
  low: 1,
  normal: 2,
  high: 3,
  urgent: 4,
  immediate: 5
}

export const BUG_PRIORITY_INDEX = {
  1: 'Low',
  2: 'Normal',
  3: 'High',
  4: 'Urgent',
  5: 'Immediate'
}

export const BUG_DONE_PERCENT = [
  { label: '0%', value: 0 },
  { label: '10%', value: 10 },
  { label: '20%', value: 20 },
  { label: '30%', value: 30 },
  { label: '40%', value: 40 },
  { label: '50%', value: 50 },
  { label: '60%', value: 60 },
  { label: '70%', value: 70 },
  { label: '80%', value: 80 },
  { label: '90%', value: 90 },
  { label: '100%', value: 100 }
]

export const BUG_DONE_PERCENT_INDEX = {
  0: '0%',
  10: '10%',
  20: '20%',
  30: '30%',
  40: '40%',
  50: '50%',
  60: '60%',
  70: '70%',
  80: '80%',
  90: '90%',
  100: '100%'
}

export const BUG_CATEGORY = [
  { label: 'Bug nội bộ', value: 1 },
  { label: 'Bug khách hàng', value: 2 }
]

export const BUG_CATEGORY_VALUE = {
  local: 1,
  customer: 2
}

export const BUG_CATEGORY_INDEX = {
  1: 'Bug nội bộ',
  2: 'Bug khách hàng'
}

export const REQUIREMENT_TYPE = [
  { label: 'Yêu cầu khách hàng', value: 0 },
  { label: 'Yêu cầu nội bộ', value: 1 }
]

export const REQUIREMENT_TYPE_INDEX = {
  0: 'Yêu cầu khách hàng',
  1: 'Yêu cầu nội bộ'
}

export const REQUIREMENT_TYPE_VALUE = {
  customer: 0,
  local: 1
}

export const REQUIREMENT_REQUEST_STATUS = [
  { label: 'Open', value: 1 },
  { label: 'Closed', value: 0 }
]
export const REQUIREMENT_REQUEST_STATUS_VALUE = {
  open: 1,
  closed: 0
}

export const REQUIREMENT_REQUEST_STATUS_INDEX = {
  1: 'Open',
  0: 'Closed'
}

export const REQUIREMENT_PROCESS_STATUS = [
  { value: 0, label: 'New' },
  { value: 1, label: 'In progress' },
  { value: 2, label: 'Resolved' },
  { value: 3, label: 'Testing' },
  { value: 4, label: 'Waiting4Review' },
  { value: 5, label: 'Feedback' },
  { value: 6, label: 'Done' },
  { value: 7, label: 'Pending' },
  { value: 8, label: 'Deleted' }
]

export const REQUIREMENT_PROCESS_STATUS_VALUE = {
  new: 0,
  in_progress: 1,
  resolved: 2,
  testing: 3,
  waiting4review: 4,
  feedback: 5,
  done: 6,
  pending: 7,
  deleted: 8
}

export const REQUIREMENT_PROCESS_STATUS_INDEX = {
  0: 'New',
  1: 'In progress',
  2: 'Resolved',
  3: 'Testing',
  4: 'Waiting4Review',
  5: 'Feedback',
  6: 'Done',
  7: 'Pending',
  8: 'Deleted'
}

export const MST_LIFECYCLE_TYPE = [
  { label: 'No group function', value: 0 },
  { label: 'Group function', value: 1 }
]

export const MST_LIFECYCLE_TYPE_VALUE = {
  no_group_function: 0,
  group_function: 1
}

export const APPROVE_STATUS_ANALYTICS = [
  { label: 'Chưa phê duyệt', value: 0 },
  { label: 'Đã phê duyệt', value: 1 }
]

export const APPROVE_STATUS_ESTIMATE = [
  { label: 'Chưa phê duyệt', value: 0 },
  { label: 'Đã phê duyệt', value: 1 }
]

export const APPROVE_STATUS_VALUE = {
  not_approve: 0,
  approved: 1
}

export const MST_ITEM_TYPE_DEFAULT_CREATE_ITEM = [
  { label: 'Có', value: 1 },
  { label: 'Không', value: 0 }
]

export const MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_INDEX = {
  1: 'Có',
  0: 'Không'
}

export const MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_VALUE = {
  yes: 1,
  no: 0
}

export const MST_ITEM_TYPE_DEFAULT = [
  { label: 'Có', value: 1 },
  { label: 'Không', value: 0 }
]

export const MST_ITEM_TYPE_DEFAULT_VALUE = {
  yes: 1,
  no: 0
}

export const TYPE_LOG_INDEX = {
  1: 'task',
  2: 'người thực hiện',
  3: 'file'
}

export const QA_TYPE_LOG = {
  1: 'câu hỏi',
  2: 'câu trả lời'
}

export const IS_PARTNER = [
  { label: 'Không', value: 0 },
  { label: 'Có', value: 1 }
]

export const IS_PARTNER_VALUE = {
  yes: 1,
  no: 0
}

export const COPY_TEST_RESULT = [
  {
    value: 1,
    label: 'Có'
  },
  {
    value: 0,
    label: 'Không'
  }
]

export const COPY_TEST_RESULT_VALUE = {
  yes: 1,
  no: 0
}
