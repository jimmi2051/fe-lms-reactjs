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
  listModuleByUser: initListModuleUser
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
  listModuleByUser
};
