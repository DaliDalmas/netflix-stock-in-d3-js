import TimeSeries from "../components/TimeSeries"
import './Home.css'

export default function Home({data}){

    const df = data.map(row=>{
        return {
            date: row.date,
            value: row.close
        }
    }).sort((a, b) => a.date - b.date)

    return (
        <div>
            <h1 className="chart-title">NETFLIX STOCK CLOSING PRICE OVER TIME</h1>
            <TimeSeries df={df} width={1500} height={700}/>
        </div>
    )
}