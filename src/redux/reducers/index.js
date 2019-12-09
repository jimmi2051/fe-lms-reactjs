import user, { initialState as initUser } from "./user";
import registerUser, { initialState as initRegisterUser } from "./user";
import auth, { initialState as initialAuth } from "./auth";
import roles, { initialState as initRoles } from "./user";
import isCreatedTraining, {
  initialState as initCreatedTraining
} from "./training";
import isCreatedModule, { initialState as initCreatedModule } from "./module";
import listModule, { initialState as initListModule } from "./module";
import isCreatedCourse, { initialState as initCreatedCourse } from "./course";
import listCourse, { initialState as initListCourse } from "./course";
import isCreatedLearningPath, {
  initialState as initCreatedLearningPath
} from "./training";
import listCourseFitler, {
  initialState as initListCourseFilter
} from "./course";
import listCourseByUser, { initialState as initListCourseUser } from "./course";
import listModuleByUser, { initialState as initListModuleUser } from "./course";
import isCreatedCourseModule, {
  initialState as initCreatedCourseModule
} from "./course";
import filterModuleByCourse, {
  initialState as initFilterModuleCourse
} from "./module";
import listContent, { initialState as initListContent } from "./content";
import listContentByModule, {
  initialState as initListContentByModule
} from "./content";

import listTraining, { initialState as initListTraining } from "./training";

import training, { initialState as initTraining } from "./training";

import trainingByCat, { initialState as initTrainingByCat } from "./training";

import isCreateContent, { initialState as initCreateContent } from "./content";

import isCreateData, { initialState as initCreateData } from "./content";

import trainingAll, { initialState as initTrainingAll } from "./training";
import listTrainingLearn, {
  initialState as initListTrainingLearn
} from "./training";
import categoryAll, { initialState as initCategoryAll } from "./training";
import isAddTraining, { initialState as initIsAddTraining } from "./training";
import isUpdateActivity, {
  initialState as initIsUpdateActivity
} from "./training";
import listCoursePaging, {
  initialState as initListCoursePaging
} from "./course";
import listModulePaging, {
  initialState as initListModulePaging
} from "./module";
import listContentPaging, {
  initialState as initListContentPaging
} from "./content";
export const exampleInitialState = {
  user: initUser,
  auth: initialAuth,
  registerUser: initRegisterUser,
  roles: initRoles,
  isCreatedTraining: initCreatedTraining,
  isCreatedModule: initCreatedModule,
  listModule: initListModule,
  isCreatedCourse: initCreatedCourse,
  listCourse: initListCourse,
  isCreatedLearningPath: initCreatedLearningPath,
  listCourseFitler: initListCourseFilter,
  listCourseByUser: initListCourseUser,
  listModuleByUser: initListModuleUser,
  isCreatedCourseModule: initCreatedCourseModule,
  filterModuleByCourse: initFilterModuleCourse,
  listContent: initListContent,
  listContentByModule: initListContentByModule,
  listTraining: initListTraining,
  training: initTraining,
  trainingByCat: initTrainingByCat,
  isCreateData: initCreateData,
  isCreateContent: initCreateContent,
  trainingAll: initTrainingAll,
  categoryAll: initCategoryAll,
  isAddTraining: initIsAddTraining,
  listTrainingLearn: initListTrainingLearn,
  isUpdateActivity: initIsUpdateActivity,
  listCoursePaging: initListCoursePaging,
  listModulePaging: initListModulePaging,
  listContentPaging: initListContentPaging
};

export default {
  user,
  auth,
  registerUser,
  roles,
  isCreatedTraining,
  isCreatedModule,
  listModule,
  isCreatedCourse,
  listCourse,
  isCreatedLearningPath,
  listCourseFitler,
  listCourseByUser,
  listModuleByUser,
  isCreatedCourseModule,
  filterModuleByCourse,
  listContent,
  listContentByModule,
  listTraining,
  training,
  trainingByCat,
  isCreateData,
  isCreateContent,
  trainingAll,
  categoryAll,
  isAddTraining,
  listTrainingLearn,
  isUpdateActivity,
  listCoursePaging,
  listModulePaging,
  listContentPaging
};
