import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Button, Form, Row, Col, Badge } from "react-bootstrap";
import subjectData from "./cs-2019.json"


let styles = {
    container: {
        backgroundColor: "white",
        padding: "1em 1em 1em 1em",
        borderRadius: "10px"
    },
    tableHead: {
        marginBottom: "2em",
        fontWeight: "bold"
    },
    creditColor: {
        color: "#808080",
        marginLeft: "-3em"
    },
    courseCodeFont: {
        fontWeight: "bold"
    },
    gradeFont: {
        color: "#316CF4",
        fontWeight: "bold",
        marginTop: "-0.5em"
    },
    courseRow: {
        marginBottom: "0.5em"
    }
}

function GpaTable(props) {
    let semesterData = props.semesterData[props.semester]
    const [courseRowState, setCourseRowState] = useState([])
    let course_row = []
    useEffect(() => {
        // console.log(semesterData)
        for (var course in semesterData["courses"]) {
            course = subjectData["curriculum"]["subjects"].find((e) => e.code == course)
            course_row.push(
                <Row style={styles.courseRow} key={course.code}>
                    <Col>
                        <Row>
                            <Col style={styles.courseCodeFont} lg={2}>
                                        {course.code}
                            </Col>
                            <Col style={styles.creditColor}>
                                {course.credit} CR.
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={10}>
                                {course.name}
                            </Col>
                            <Col style={styles.gradeFont}>
                                {semesterData["courses"][course.code]}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            )
        }
        setCourseRowState(course_row)

    }, [props])

    return (
        <Container style={styles.container}>
            {/* Table Head */}
            <Row style={styles.tableHead}>
                <Col lg={9}>
                    SEMESTER {props.semester}
                </Col>
                <Col>
                    <Badge pill bg="primary">
                        {props.semesterData[props.semester]["gpa"]}
                    </Badge>
                    {' '}
                    <Badge pill bg="secondary">
                        {props.semesterData[props.semester]["credits"]} CREDITS
                    </Badge>
                </Col>
            </Row>
            {/* Single Course */}
            {courseRowState}
        </Container>
    )
}
export default GpaTable;