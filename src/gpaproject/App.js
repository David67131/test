import './App.css';
import Selector from './Selector';
import { Container, Button, Form, Row, Col, Badge } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import GpaTable from "./gpaTable";
import useLocalStorage from "react-localstorage-hook";
import {useEffect, useState} from "react"
import subjectData from "./cs-2019.json"
import Page from "./lineChart"

let styles = {
	container: {
    marginTop: "5em",
	},
	semesterTable: {
    marginBottom: "1em"
	},
    summary: {
        backgroundColor: "white",
        padding: "1em 1em 1em 1em",
        borderRadius: "10px",
        marginBottom: "1em"
    },
    chartContainer: {
        backgroundColor: "white",
        padding: "1em 1em 1em 1em",
        borderRadius: "10px",
        marginBottom: "1em",
        width: "98%"
    },
}


function App() {
    // set background color
	document.body.style = 'background: #127bd2;';
	const [dataItems, setDataItems] = useLocalStorage("dataItems", {})
    const [totalGpa, setTotalGpa] = useState(0)
    const [totalCredits, setTotalCredits] = useState(0)

    useEffect(() => {
        let gpa = 0
        let credits = 0
        for (var seme in dataItems) {
            gpa += dataItems[seme]["gpa"]
            credits += dataItems[seme]["credits"]
        }
        setTotalGpa(parseFloat((gpa / Object.keys(dataItems).length).toFixed(2)))
        setTotalCredits(credits)
    }, [dataItems])

    const gpaTables = []
    var semesterList = []
    for (var seme in dataItems) {
        semesterList.push(seme)
    }
    // sort semester
    semesterList = semesterList.sort(function(a, b) {
        a = a.split("/")
        var a_seme = a[0]
        var a_year = a[1]
        b = b.split("/")
        var b_seme = b[0]
        var b_year = b[1]
        if (a_year > b_year) {
            return 1
        }else if (a_year < b_year) {
            return -1
        }else if (a_seme > b_seme) {
            return 1
        }else {
            return -1
        }
    })
    for (var seme of semesterList) {
        // var courseData = dataItems[seme]
        // console.log("course data", courseData)
        gpaTables.push(
            <Row style={styles.semesterTable} key={seme}>
                <Col>
                    <GpaTable semesterData={dataItems} semester={seme}>

                    </GpaTable>
                </Col>
            </Row>
        )
    }
    // console.log(dataItems)

	return (
    <Container style={styles.container}>
            <Row>
                <Container style={styles.chartContainer}>
                    <Page dataItems={dataItems}></Page>
                </Container>
            </Row>
            <Row>
                <Col xs={3}>
					<Selector dataItems={dataItems} setDataItems={setDataItems}>

					</Selector>
                </Col>
                <Col>
                    <Container style={styles.summary}>
                        {/* Table Head */}
                        <Row style={{fontWeight: "bold"}}>
                            <Col lg={9}>
                                SUMMARY
                            </Col>
                            <Col>
                                <Badge pill bg="primary">
                                    {totalGpa}
                                </Badge>
                                {' '}
                                <Badge pill bg="secondary">
                                    {totalCredits} CREDITS
                                </Badge>
                            </Col>
                        </Row>
                    </Container>
                    {gpaTables}
                </Col>
            </Row>

            <Row>

            </Row>
    </Container>
    );
}

export default App;
