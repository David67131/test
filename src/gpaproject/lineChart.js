import React from 'react';
import ReactECharts from 'echarts-for-react';

import "echarts/i18n/langFR";

const Page: React.FC = ({dataItems}) => {
    // console.log(dataItems)
    var gpaList = []
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
        gpaList.push(dataItems[seme]["gpa"])
    }
    const option = {
        title: {
        text: 'GPA Line Chart'
        },
        toolbox: {
            feature: {
                saveAsImage: {},
                // dataZoom: {},
                // restore: {}
            }
        },
        tooltip: {},
        legend: {
            data:['GPA']
        },
        xAxis: {
            data: semesterList
        },
        yAxis: {},
        series: [{
            name: 'GPA',
            type: 'line',
            data: gpaList
        }]
    };

    return <ReactECharts
        option={option}
        style={{ height: 350 }}
        opts={{ locale: 'FR' }}
    />;
};

export default Page;