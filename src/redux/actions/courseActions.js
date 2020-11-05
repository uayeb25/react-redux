import * as types from "./actionTypes";
import * as courseAPi from "../../api/courseApi";

export function createCourse(course) {
  return { type: types.CREATE_COURSE, course };
}

export function loadCourseSuccess(courses){
  return {type: types.LOAD_COURSES_SUCCESS, courses};
}

export function loadCourses(){
  return function(dispatch){
    return courseAPi.getCourses().then( courses => {
      dispatch(loadCourseSuccess(courses));
    }).catch(error=>{
      throw error;
    })
  }
}