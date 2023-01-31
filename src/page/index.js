import * as React from "react"
import './index.css'
import {Select, Button, Form, Row, Col, Badge} from 'antd';
import {useEffect, useState} from "react";
import csData from '../data/cs-2019.json';
import itData from '../data/it-2019.json';
import * as echarts from "echarts";

const grades = [
    {
        "name": "A",
        "value": 4
    },
    {
        "name": "A-",
        "value": 3.75
    },
    {
        "name": "B+",
        "value": 3.25
    },
    {
        "name": "B",
        "value": 3
    },
    {
        "name": "B-",
        "value": 2.75
    },
    {
        "name": "C+",
        "value": 2.25
    },
    {
        "name": "C",
        "value": 2
    },
    {
        "name": "C-",
        "value": 1.75
    },
    {
        "name": "D",
        "value": 1
    },
    {
        "name": "F",
        "value": 0
    },
    {
        "name": "W",
        "value": "exclude"
    }
]

export default function Gpa() {

    const selectableSemester = [
        '1/2022',
        '2/2022',
        '3/2022',
        '1/2023',
        '2/2023',
       '3/2023'
    ]
    const [selectAbleCourses, setSelectAbleCourses] = useState([]);
    const [selectedSemester, setSemester] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [grade, setGrade] = useState('');
    const [courseData, setCourseData] = useState([]);

    const majorChange = (value) => {
        const course = []
        if (value === 'cs') {
            for (let subjectsKey of csData.curriculum.subjects) {
                for (let c of subjectsKey.subjects) {
                    course.push(c)
                }
            }
            setSelectAbleCourses(course)
        } else {
            for (let subjectsKey of itData.curriculum.subjects) {
                for (let c of subjectsKey.subjects) {
                    course.push(c)
                }
            }
            setSelectAbleCourses(course)
        }
    };

    const semesterChange = (value) => {
        setSemester(value)
    };

    const courseChange = (value) => {
        setSelectedCourse(value)
    };

    const gradeChange = (value) => {
        setGrade(value)
    };

    const click = () => {
        const cdd = courseData
        cdd.push({
            semester: selectedSemester,
            courseCode: selectedCourse,
            course: selectAbleCourses.find(item => item.code == selectedCourse).name,
            grade: grade
        })
        setCourseData([...cdd])
        localStorage.setItem("courseData", JSON.stringify(cdd))
    };


    useEffect(() => {
        var chartDom = document.getElementById('graph');
        var myChart = echarts.init(chartDom);
        var option;
        // calculate the result
        var map = new Map()
        var cmap = courseData.reduce(function (acc, item) {
                    var key = item.semester;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    if (item.grade != 'exclude') {
                        acc[key].push(item.grade)
                    } else {
                        acc[key].push(0)
                    }
                    return acc;
                }, {})
        for (let key in cmap) {
            console.log('premap=',cmap[key])
            console.log('len=',cmap[key].length)
            console.log('sum=',(cmap[key].map(item => {
                                return item.grade == 'exclude' ? 0 : item
                            }).reduce((acc, curr) => acc + curr, 0)))
            cmap[key] = (cmap[key].map(item => {
                                return item.grade == 'exclude' ? 0 : item
                            }).reduce((acc, curr) => acc + curr, 0) / cmap[key].length)
}
        console.log('cmap=', cmap)

        option = {
            xAxis: {
                type: 'category',
                data: Object.keys(cmap)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: Object.values(cmap),
                    type: 'line'
                }
            ]
        };

        option && myChart.setOption(option);

    })

    useEffect(() => {
        const lld = JSON.parse(localStorage.getItem('courseData'))
        if (lld != null) {
            setCourseData(lld)
        }
    }, []);

    return (<div className="main">
        <div className="left">
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                autoComplete="off"
            >

                <Form.Item
                    label="Major"
                    name="Major"
                >
                    <Select
                        defaultValue="select"
                        onChange={majorChange}
                        options={[

                            {
                                value: 'cs',
                                label: 'cs',
                            },
                            {
                                value: 'it',
                                label: 'it',
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Semester"
                    name="Semester"
                >
                    <Select
                        defaultValue="select"
                        onChange={semesterChange}
                        options={
                            selectableSemester.map(g => {
                                return {
                                    value: `${g}`,
                                    label: `${g}`
                                }
                            })
                        }

                    />
                </Form.Item>

                <Form.Item
                    label="Subject"
                    name="Subject"
                >
                    <Select
                        defaultValue="select"
                        onChange={courseChange}
                        options={selectAbleCourses.map(item => {
                            return {
                                value: item.code,
                                label: `${item.code}----${item.name}`
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label="Grade"
                >

                    <Row gutter={8}>
                        <Col span={12}>
                            <Select
                                onChange={gradeChange}
                                defaultValue="select"
                                options={grades.map(item => {
                                    return {
                                        value: item.value,
                                        label: `${item.name}----${item.value}`
                                    }
                                })}
                            />
                        </Col>
                        <Col span={8}>
                            <Button onClick={click} type={"primary"}>Add</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
            <div id="graph" className="graph"/>
        </div>
        <div className="right">
            <div className="summary">
                <span>Summary</span>
                <div className="badge">
                    <span>Average Credit</span>
                    <Badge style={{marginLeft: "10px"}} count={
                        (courseData.map(item => {
                                return item.grade == 'exclude' ? 0 : item.grade
                            }).reduce((acc, curr) => acc + curr, 0) /
                            courseData.filter(item => item.grade != 'exclude').length)
                            .toFixed(2)
                    } showZero color='#faad14'/>
                </div>
            </div>


            {
                Object.keys(courseData.reduce(function (acc, item) {
                    var key = item.semester;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(item);
                    return acc;
                }, {})).map(semester => {
                    return <div key={semester} className="item">
                        <div className="item__header">
                            <span style={{color: "red"}}>Semester {semester}</span>
                            <Badge style={{
                                width: '50px',
                                float: "right",
                                marginRight: '10px',
                                border: "solid red 1px"
                            }} count={
                                (courseData.filter(item => item.semester == semester)
                                        .map(item => {
                                            return item.grade == 'exclude' ? 0 : item.grade
                                        })
                                        .reduce((acc, curr) => acc + curr, 0) /
                                    courseData.filter(item => item.semester == semester)
                                        .filter(item => item.grade != 'exclude').length
                                ).toFixed(2)
                            } color='#0D6EFD'></Badge>
                        </div>
                        <div className="item_child">
                            {
                                courseData.filter(item => item.semester == semester).map(item => {
                                    return <div key={item.courseCode}>
                                        <span>{item.courseCode} --- {item.course} </span>
                                        <span style={{
                                            float: "right",
                                            marginRight: "20px",
                                            color: "blue"
                                        }}>{grades.find(g => g.value == item.grade).name}</span>
                                    </div>
                                })
                            }

                        </div>
                    </div>
                })
            }
        </div>
    </div>)
}
