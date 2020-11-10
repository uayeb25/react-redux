import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";

const CourseManegePage = ({ courses, authors, actions, history, ...props }) => {

    const [course, setCourse] = useState({...props.course});
    const [errors, setErrors] = useState({});

    useEffect(()=>{
        if( courses.length === 0 ){
            actions.loadCourses().catch(error=>{
                throw error;
            })
        }else{
            setCourse({...props.course});
        }
        if( authors.length === 0 ){
            actions.loadAuthors().catch(error=>{
                throw error;
            })
        }
    },[props.course]);

    function handleChange(event){
        const { name, value } = event.target;
        setCourse( prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value,10) : value
        }));
    }

    function handleSave(event) {
        event.preventDefault();
        actions.saveCourse(course).then(()=>{
            history.push("/courses");
        });
    }
    
    return <CourseForm 
            course={course} 
            errors={errors} 
            authors={authors} 
            onChange={handleChange} 
            onSave={handleSave} 
            />;
    
}

CourseManegePage.propTypes = {
    course: PropTypes.object.isRequired,
    courses: PropTypes.array.isRequired,
    authors: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

export function getCourseBySlug(courses, slug){
    return courses.find( course => course.slug === slug ) || null;
}

function mapStateToProps(state, ownProps){
    const slug = ownProps.match.params.slug;
    const course = slug && state.courses.length > 0 
    ? getCourseBySlug(state.courses, slug) 
    : newCourse;
    return {
        course,
        courses: state.courses,
        authors: state.authors
    }
}

function mapDispatchToProps(dispatch){
    return{
        actions: {
            loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
            loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
            saveCourse: bindActionCreators(courseActions.saveCourse, dispatch)
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CourseManegePage);