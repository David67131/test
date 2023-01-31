import "./Selector.css"
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from "react"
import subjectData from "./cs-2019.json"


let styles = {
    container: {
        backgroundColor: "white",
        padding: "1em 1em 1em 1em",
        borderRadius: "10px",
        marginBottom: "1em"
    },
    textRight: {
        textAlign: "right"
    }
}

var semesterOptions = [
    "1/2021", "2/2021", "3/2021", "1/2022"
]
semesterOptions = semesterOptions.map((v, i) => {
    return (
        <option key={i}>{v}</option>
    )
})
var subjectOptions = subjectData["curriculum"]["subjects"]
subjectOptions = subjectOptions.map((v, i) => {
    return (
        <option key={i} value={v.code}>{v.code} {v.name} {v.credit} CR.</option>
    )
})

var courseGradeTable = {"A": 4, "A-": 3.75, "B+": 3.25, "B": 3, "B-": 2.75, "C+": 2.25, "C": 2, "C-": 1.75, "D": 1, "F": 0, "W": 0}
var courseGradeOptions = []
for (var cg in courseGradeTable) {
    courseGradeOptions.push(
        <option key={cg}>{cg}</option>
    )
}

var freeCourseGradeTable = {"S": 0, "U": 0, "W": 0}
var freeCourseGradeOptions = []
for (var cg in freeCourseGradeTable) {
    freeCourseGradeOptions.push(
        <option key={cg}>{cg}</option>
    )
}


function Selector(props) {
    const semesterRef = useRef()
    const subjectRef = useRef()
    const gradeRef = useRef()

    const [allCourseGradeOptions, setAllCourseGradeOptions] = useState(courseGradeOptions)

    const update_gpa_credits = (courses) => {
        let credits = 0
        let gradeValue = 0
        let gpa = 0
        for (var course in courses) {
            let courseObj = subjectData["curriculum"]["subjects"].find((e) => e.code == course)
            // skip free elective course
            if (courseObj.credit == 0) {
                continue
            }
            let grade = courses[course]
            grade = courseGradeTable[grade] * courseObj.credit
            gradeValue += grade
            credits += courseObj.credit
        }
        if (credits == 0) {
            return [0, 0]
        }
        gpa = gradeValue / credits
        gpa = parseFloat(gpa.toFixed(2))
        return [credits, gpa]
    }
    const addGpa = () => {
        let semester = semesterRef.current.value
        let semesterData = props.dataItems[semester] ? props.dataItems[semester] : {"gpa": 0.0, "credits": 0, "courses": {}}
        let courseData = semesterData["courses"]

        let subject = subjectRef.current.value
        courseData[subject] = gradeRef.current.value
        semesterData["courses"] = courseData

        // update gpa and credits
        let [credits, gpa] = update_gpa_credits(courseData)
        semesterData["gpa"] = gpa
        semesterData["credits"] = credits

        props.dataItems[semester] = semesterData
        let dataItems = {...props.dataItems}
        props.setDataItems(dataItems)
    }

    const subjectChange = () => {
        let subject = subjectRef.current.value
        subject = subjectData["curriculum"]["subjects"].find((e) => e.code == subject)
        // allCourseGradeOptions = subject.credit == 0 ? freeCourseGradeOptions : allCourseGradeOptions
        setAllCourseGradeOptions(subject.credit == 0 ? freeCourseGradeOptions : courseGradeOptions)
    }

    return (
        <Container style={styles.container}>
            <Row>
                <Col>
                    <Form>
                        {/* Semester */}
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column lg={4}>
                                Semester
                            </Form.Label>
                            <Col>
                                <Form.Select aria-label="Default select example" ref={semesterRef}>
                                    {semesterOptions}
                                    {/* <option>
                                        1/2020
                                    </option> */}
                                </Form.Select>
                            </Col>
                        </Form.Group >

                        {/* Subject */}
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column lg={4}>
                                Subject
                            </Form.Label>
                            <Col>
                                <Form.Select aria-label="Default select example" ref={subjectRef} onChange={subjectChange}>
                                    {subjectOptions}
                                    {/* <option>
                                        CS2201 Computer Programming
                                    </option> */}
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        {/* Grade */}
                        <Form.Group className="mb-3" as={Row}>
                            <Form.Label column lg={3} >
                                Grade
                            </Form.Label>
                            <Col xs={5}>
                                {/* <Form.Control type="text" ref={gradeRef}>
                                </Form.Control> */}
                                <Form.Select aria-label="Default select example" ref={gradeRef}>
                                    {allCourseGradeOptions}
                                </Form.Select>
                            </Col>
                            {/* Add Button */}
                            <Col>
                                <div className="d-grid gap-2">
                                    <Button variant="primary" onClick={addGpa}>
                                        ADD
                                    </Button>
                                </div>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>

            </Row>
        </Container>
    )
}
export default Selector;