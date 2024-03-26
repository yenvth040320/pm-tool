import RoleRepository from './role.repository'
import CategoryRepository from './category.repository'
import FunctionEventLogicalRepository from './functionEventLogical.repository'
import FunctionEventRepository from './functionEvent.repository'
import FunctionImageRepository from './functionImage.repository'
import FunctionItemPropertyRepository from './functionItemProperty.repository'
import FunctionItemValidationRepository from './functionItemValidation.repository'
import FunctionItemRepository from './functionItem.repository'
import FunctionResultDetailRepository from './functionResultDetail.repository'
import FunctionResultRepository from './functionResult.repository'
import FunctionTestCaseRepository from './functionTestCase.repository'
import FunctionRepository from './function.repository'
import MstEventRepository from './mstEvent.repository'
import MstEvnTestCaseRepository from './mstEvnTestCase.repository'
import MstItemPropertyRepository from './mstItemProperty.repository'
import MstItemTypeRepository from './mstItemType.repository'
import MstValidationRepository from './mstValidation.repository'
import ProjectRepository from './project.repository'
import VersionFunctionRepository from './versionFunction.repository'
import MstItemUsePropertyRepository from './mstItemUseProperty.repository'
import MstTestCaseCommonRepository from './mstTestCaseCommon.repository'
import MstCategoryTestCaseCommonRepository from './mstCategoryTestCaseCommon.repository'
import ActorActionRepository from './actorAction.repository'
import treeRepository from './tree.repository'
import classesRepository from './classes.repository'
import classPropertiesRepository from './classProperties.repository'
import sourceCodeRepository from './sourceCode.repository'
import branchRepository from './branch.repository'
import functionSequenceDiagramRepository from './functionSequenceDiagram.repository'
import RequirementRepository from './requirement.repository'
import TestSessionRepository from './testSession.repository'
import ApiInfoRepository from '~/repositories/apiInfo.repository'
import ApiParameterDatasourceRepository from '~/repositories/apiParameterDatasource.repository'
import ApiParameterRepository from '~/repositories/apiParameter.repository'
import ApiResponseDatasourceRepository from '~/repositories/apiResponseDatasource.repository'
import VersionApiRepository from '~/repositories/versionApi.repository'
import ApiResponseRepository from '~/repositories/apiResponse.repository'
import ApiCategoryRepository from '~/repositories/apiCategory.repository'
import ApiRepository from '~/repositories/api.repository'
import DbSchemaRepository from '~/repositories/dbSchema.repository'
import DbTableColumnRepository from '~/repositories/dbTableColumn.repository'
import DbTableForeignKeyRepository from '~/repositories/dbTableForeignKey.repository'
import DbTableVersionRepository from '~/repositories/dbTableVersion.repository'
import DbTableRepository from '~/repositories/dbTable.repository'
import FunctionItemReadDatasourceRepository from '~/repositories/functionItemReadDatasource.repository'
import FunctionItemWriteDatasourceRepository from '~/repositories/functionItemWriteDatasource.repository'
import MstTestcaseValidationRepository from '~/repositories/mstTestcaseValidation.repository'
import MstEventLevelRepository from '~/repositories/mstEventLevel.repository'
import ApiLogRepository from '~/repositories/apiLog.repository'
import DbTableLogRepository from '~/repositories/dbTableLog.repository'
import FunctionLogRepository from '~/repositories/functionLog.repository'
import FunctionTestcaseLogRepository from '~/repositories/functionTestcaseLog.repository'
import MstLifeCycleStatusRepository from '~/repositories/mstLifeCycleStatus.repository'
import MstLifeCycleRepository from '~/repositories/mstLifeCycle.repository'
import VersionFunctionLifeCycleRepository from '~/repositories/versionFunctionLifeCycle.repository'
import FunctionEtPointRepository from '~/repositories/functionEtPoint.repository'
import ProjectEtPointRepository from '~/repositories/projectEtPoint.repository'
import EntityRepository from '~/repositories/entity.repository'
import EntityRelationshipRepository from '~/repositories/entityRelationship.repository'
import FunctionItemHtmlIdRepository from '~/repositories/functionItemHtmlId.repository'
import FlowHistoryRepository from '~/repositories/flowHistory.repository'
import FlowRepository from '~/repositories/flow.repository'
import FunctionMessageRepository from '~/repositories/functionMessage.repository'
import FlowFileRepository from '~/repositories/flowFile.repository'
import EntityHistoryRepository from '~/repositories/entityHistory.repository'
import KpiRepository from '~/repositories/kpi.repository'
import GroupMemberRepository from '~/repositories/groupMember.repository'
import UserRepository from '~/repositories/user.repository'
import SupportMemberRepository from '~/repositories/supportMember.repository'
import TaskRepository from '~/repositories/task.repository'
import TaskOwnerRepository from '~/repositories/taskOwner.repository'
import TaskReplyRepository from '~/repositories/taskReply.repository'
import UserPointTransactionHistoryRepository from '~/repositories/userPointTransactionHistory.repository'
import TaskChecklistResultRepository from '~/repositories/taskChecklistResult.repository'
import TaskChecklistRepository from '~/repositories/taskChecklist.repository'
import ChecklistDetailRepository from '~/repositories/checklistDetail.repository'
import ChecklistRepository from '~/repositories/checklist.repository'
import actionRepository from '~/repositories/action.repository'
import functionUsecaseRepository from '~/repositories/functionUsecase.repository'
import functionUsecaseActionRepository from '~/repositories/functionUsecaseAction.repository'
import actorRepository from '~/repositories/actor.repository'
import ErGroupRepository from '~/repositories/erGroup.repository'
import testCaseInputRepository from '~/repositories/testCaseInput.repository'
import testCaseOutputRepository from '~/repositories/testCaseOutput.repository'
import ApiSequenceDiagramRepository from '~/repositories/apiSequenceDiagram.repository'
import TestcaseGroupRepository from '~/repositories/testcaseGroup.repository'
import TestcaseInputResultRepository from '~/repositories/testcaseInputResult.repository'
import TestcaseMatrixRepository from '~/repositories/testcaseMatrix.repository'
import TestcaseMatrixInputRepository from '~/repositories/testcaseMatrixInput.repository'
import TestcaseMatrixOutputRepository from '~/repositories/testcaseMatrixOutput.repository'
import TestcaseNumberRepository from '~/repositories/testcaseNumber.repository'
import TestcaseOutputResultRepository from '~/repositories/testcaseOutputResult.repository'
import FunctionRelationshipItemRepository from '~/repositories/functionRelationshipItem.repository'
import FunctionRelationshipRepository from '~/repositories/functionRelationship.repository'
import componentRepository from '~/repositories/component.repository'
import modelRepository from '~/repositories/model.repository'
import QuestionRepository from '~/repositories/question.repository'
import AnswerRepository from '~/repositories/answer.repository'
import componentFunctionMappingRepository from '~/repositories/componentFunctionMapping.repository'
import TestcaseOutputResultDetailRepository from '~/repositories/testcaseOutputResultDetail.repository'
import BugFileRepository from '~/repositories/bugFile.repository'
import BugNoteRepository from '~/repositories/bugNote.repository'
import BugRepository from '~/repositories/bug.repository'
import ReplyRequirementRepository from '~/repositories/replyRequirement.repository'
import RequirementEstimateRepository from '~/repositories/requirementEstimate.repository'
import RequirementFunctionRepository from '~/repositories/requirementFunction.repository'
import RequirementFunctionEventRepository from '~/repositories/requirementFunctionEvent.repository'
import RequirementFunctionItemRepository from '~/repositories/requirementFunctionItem.repository'
import ConfigRepository from '~/repositories/config.repository'
import TaskFileRepository from '~/repositories/taskFile.repository'
import CaseTestRepository from '~/repositories/caseTest.repository'
import TaskLogRepository from '~/repositories/taskLog.repository'
import FunctionItemLanguageKeyRepository from '~/repositories/functionItemLanguageKey.repository'
import AutoTestResultRepository from '~/repositories/autoTestResult.repository'
import QaLogRepository from '~/repositories/qaLog.repository'
import MstBugTypeRepository from '~/repositories/mstBugType.repository'

/**
 * Make repository
 *
 * @param {Object} $axios
 * @param {String} resource
 * @returns {Object}
 */
const make = ($axios, resource) => ({
  resource,

  /**
   * Get list resources
   *
   * @param {Object} config
   * @returns {Object}
   */
  list(config = {}) {
    return $axios.get(`${this.resource}`, config)
  },

  /**
   * Create resource
   *
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  create(data, config = {}) {
    return $axios.post(`${this.resource}`, data, config)
  },

  /**
   * Show detail resource
   *
   * @param {Number} id
   * @param {Object} config
   * @returns {Object}
   */
  show(id, config = {}) {
    return $axios.get(`${this.resource}/${id}`, config)
  },

  /**
   * Update resource
   *
   * @param {Number} id
   * @param {Object} data
   * @param {Object} config
   * @returns {Object}
   */
  update(id, data, config = {}) {
    return $axios.put(`${this.resource}/${id}`, data, config)
  },

  /**
   * Delete resource
   *
   * @param {Number} id
   * @param {Object} config
   * @returns {Object}
   */
  delete(id, config = {}) {
    return $axios.delete(`${this.resource}/${id}`, config)
  }
})

/**
 * Binding repository
 *
 * @param {Object} $axios
 * @param {Functiion} createRepository
 * @returns {Object}
 */
const bind = ($axios, createRepository) => {
  const repository = createRepository($axios)
  if (!repository.resource) {
    throw new Error('Missing resource')
  }

  return {
    ...make($axios, repository.resource),
    ...repository
  }
}

export default $axios => ({
  role: bind($axios, RoleRepository),
  user: bind($axios, UserRepository),
  category: bind($axios, CategoryRepository),
  functionEventLogical: bind($axios, FunctionEventLogicalRepository),
  functionEvent: bind($axios, FunctionEventRepository),
  functionImage: bind($axios, FunctionImageRepository),
  functionItemProperty: bind($axios, FunctionItemPropertyRepository),
  functionItemValidation: bind($axios, FunctionItemValidationRepository),
  functionItem: bind($axios, FunctionItemRepository),
  functionResultDetail: bind($axios, FunctionResultDetailRepository),
  functionResult: bind($axios, FunctionResultRepository),
  functionTestCase: bind($axios, FunctionTestCaseRepository),
  function: bind($axios, FunctionRepository),
  mstEvent: bind($axios, MstEventRepository),
  mstEvnTestCase: bind($axios, MstEvnTestCaseRepository),
  mstItemProperty: bind($axios, MstItemPropertyRepository),
  mstItemType: bind($axios, MstItemTypeRepository),
  mstTestcaseValidation: bind($axios, MstTestcaseValidationRepository),
  mstValidation: bind($axios, MstValidationRepository),
  project: bind($axios, ProjectRepository),
  versionFunction: bind($axios, VersionFunctionRepository),
  mstItemUsePropertyRepository: bind($axios, MstItemUsePropertyRepository),
  mstTestCaseCommon: bind($axios, MstTestCaseCommonRepository),
  mstCategoryTestCaseCommon: bind($axios, MstCategoryTestCaseCommonRepository),
  apiInfo: bind($axios, ApiInfoRepository),
  apiParameterDatasource: bind($axios, ApiParameterDatasourceRepository),
  apiParameter: bind($axios, ApiParameterRepository),
  apiResponseDatasource: bind($axios, ApiResponseDatasourceRepository),
  apiResponse: bind($axios, ApiResponseRepository),
  versionApi: bind($axios, VersionApiRepository),
  apiCategory: bind($axios, ApiCategoryRepository),
  api: bind($axios, ApiRepository),
  dbSchema: bind($axios, DbSchemaRepository),
  dbTableColumn: bind($axios, DbTableColumnRepository),
  dbTableForeignKey: bind($axios, DbTableForeignKeyRepository),
  dbTableVersion: bind($axios, DbTableVersionRepository),
  dbTable: bind($axios, DbTableRepository),
  functionItemReadDatasource: bind($axios, FunctionItemReadDatasourceRepository),
  functionItemWriteDatasource: bind($axios, FunctionItemWriteDatasourceRepository),
  mstEventLevel: bind($axios, MstEventLevelRepository),
  apiLog: bind($axios, ApiLogRepository),
  dbTableLog: bind($axios, DbTableLogRepository),
  functionLog: bind($axios, FunctionLogRepository),
  functionTestcaseLog: bind($axios, FunctionTestcaseLogRepository),
  mstLifeCycleStatus: bind($axios, MstLifeCycleStatusRepository),
  mstLifeCycle: bind($axios, MstLifeCycleRepository),
  versionFunctionLifeCycle: bind($axios, VersionFunctionLifeCycleRepository),
  functionEtPoint: bind($axios, FunctionEtPointRepository),
  projectEtPoint: bind($axios, ProjectEtPointRepository),
  entity: bind($axios, EntityRepository),
  entityRelationship: bind($axios, EntityRelationshipRepository),
  functionItemHtmlId: bind($axios, FunctionItemHtmlIdRepository),
  flowHistory: bind($axios, FlowHistoryRepository),
  flow: bind($axios, FlowRepository),
  functionMessage: bind($axios, FunctionMessageRepository),
  flowFile: bind($axios, FlowFileRepository),
  entityHistory: bind($axios, EntityHistoryRepository),
  kpi: bind($axios, KpiRepository),
  groupMember: bind($axios, GroupMemberRepository),
  supportMember: bind($axios, SupportMemberRepository),
  task: bind($axios, TaskRepository),
  taskOwner: bind($axios, TaskOwnerRepository),
  taskReply: bind($axios, TaskReplyRepository),
  userPointTransactionHistory: bind($axios, UserPointTransactionHistoryRepository),
  taskChecklistResult: bind($axios, TaskChecklistResultRepository),
  taskChecklist: bind($axios, TaskChecklistRepository),
  checklistDetail: bind($axios, ChecklistDetailRepository),
  checklist: bind($axios, ChecklistRepository),
  actor: bind($axios, actorRepository),
  action: bind($axios, actionRepository),
  functionUsecase: bind($axios, functionUsecaseRepository),
  functionUsecaseAction: bind($axios, functionUsecaseActionRepository),
  actorAction: bind($axios, ActorActionRepository),
  tree: bind($axios, treeRepository),
  classes: bind($axios, classesRepository),
  classProperties: bind($axios, classPropertiesRepository),
  sourceCode: bind($axios, sourceCodeRepository),
  branch: bind($axios, branchRepository),
  erGroup: bind($axios, ErGroupRepository),
  testCaseInput: bind($axios, testCaseInputRepository),
  testCaseOutput: bind($axios, testCaseOutputRepository),
  functionSequenceDiagram: bind($axios, functionSequenceDiagramRepository),
  apiSequenceDiagram: bind($axios, ApiSequenceDiagramRepository),
  testcaseGroup: bind($axios, TestcaseGroupRepository),
  testcaseInputResult: bind($axios, TestcaseInputResultRepository),
  testcaseMatrix: bind($axios, TestcaseMatrixRepository),
  testcaseMatrixInput: bind($axios, TestcaseMatrixInputRepository),
  testcaseMatrixOutput: bind($axios, TestcaseMatrixOutputRepository),
  testcaseNumber: bind($axios, TestcaseNumberRepository),
  testcaseOutputResult: bind($axios, TestcaseOutputResultRepository),
  functionRelationshipItem: bind($axios, FunctionRelationshipItemRepository),
  functionRelationship: bind($axios, FunctionRelationshipRepository),
  model: bind($axios, modelRepository),
  answer: bind($axios, AnswerRepository),
  question: bind($axios, QuestionRepository),
  component: bind($axios, componentRepository),
  componentFunctionMapping: bind($axios, componentFunctionMappingRepository),
  testcaseOutputResultDetail: bind($axios, TestcaseOutputResultDetailRepository),
  bugFile: bind($axios, BugFileRepository),
  bugNote: bind($axios, BugNoteRepository),
  bug: bind($axios, BugRepository),
  requirement: bind($axios, RequirementRepository),
  replyRequirement: bind($axios, ReplyRequirementRepository),
  requirementEstimate: bind($axios, RequirementEstimateRepository),
  requirementFunction: bind($axios, RequirementFunctionRepository),
  requirementFunctionEvent: bind($axios, RequirementFunctionEventRepository),
  requirementFunctionItem: bind($axios, RequirementFunctionItemRepository),
  config: bind($axios, ConfigRepository),
  taskFile: bind($axios, TaskFileRepository),
  caseTest: bind($axios, CaseTestRepository),
  taskLog: bind($axios, TaskLogRepository),
  functionItemLanguageKey: bind($axios, FunctionItemLanguageKeyRepository),
  autoTestResult: bind($axios, AutoTestResultRepository),
  qaLog: bind($axios, QaLogRepository),
  testSession: bind($axios, TestSessionRepository),
  mstBugType: bind($axios, MstBugTypeRepository)
})
