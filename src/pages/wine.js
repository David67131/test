import * as React from 'react'

const wineImage = {
    width: '5rem'
}
export default function Wine() {
    
    let items = []
    let [wineTitles, setWineTitles] = React.useState([])

    React.useEffect(async () => {
        
        let res = await fetch('https://api.sampleapis.com/wines/reds')
        let wines = await res.json()
        for (let i = 0; i < wines.length; i++) {
            console.log(wines[i].winery)
            items.push(<li>
                <div style={{  width:"20rem", overflow: "hidden" }} >
                    <div style={{ width: "11rem", float: "left" }}> <img style={wineImage} src={wines[i].image} /> </div>
                    <div >  <b>{wines[i].winery}</b> - {wines[i].wine} </div>
                </div>
            </li >)
        }

        setWineTitles(items)
    }, [])

    return (
        <>
            <h1>Wine</h1>
            <ul>
                {wineTitles}
            </ul>
        </>
    )
}