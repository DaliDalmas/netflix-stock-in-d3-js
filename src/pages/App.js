import './App.css';
import { csv, timeParse } from 'd3';
import { useEffect, useState } from 'react';

import Home from './Home';

function App() {
  const [data, setData] = useState(null);
  const parseTime = timeParse('%Y-%m-%d')
  const rowConverter = d => {
    return {
      date: parseTime(d.Date),
      open: +d.Open,
      high: +d.High,
      low: +d.Low,
      close: +d.Close,
      dividends: +d.Dividends,
      volume: +d.Volume,
      splits: +d['Stock Splits']
    }
  }
  useEffect(()=>{
    csv(
      'https://raw.githubusercontent.com/kalilurrahman/NFLXStockData/main/Netflix_stock_history.csv',
      rowConverter
      )
    .then(result=>{
      setData(result)
    })
  })

  return (
    <div className="App">
     {data?<Home data={data}/>:<div>Data Loading page</div>}
    </div>
  );
}

export default App;
