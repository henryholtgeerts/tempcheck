import './App.css';
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient';

import Thumb from './components/thumb'

function App() {

  const getEligibility = () => {
    const lastCheck = localStorage.getItem('last_check')
    if ( !lastCheck ) {
        return true
    }
    const currentTime = new Date()
    const prevTime = new Date(lastCheck)
    const timeDiff = ( currentTime.getTime() - prevTime.getTime() ) / ( 1000*60*60*24 )
    return timeDiff > 1 ? true : false
  }

  const [ isEligible, setIsEligible ] = useState(getEligibility())
  const [ temp, setTemp ] = useState(100)
  const [ avgTemp, setAvgTemp ] = useState(null)

  const [ isDisabled, setIsDisabled ] = useState(false)

  const handleSubmit = async (e) => {
      e.preventDefault()
      setIsDisabled(true);
      const { data, error } = await supabase
          .from('checks')
          .insert([
              { temp: temp }
          ])
      
      if ( error === null ) {
          setIsDisabled(false)
          localStorage.setItem('last_check', data[0].created_at);
          setIsEligible(false)
      }
  }

  const getAvgTemp = async () => {
      const { data } = await supabase
      .rpc('avg_temp')
      setAvgTemp(data);
  }

  useEffect(() => {
      if ( isEligible === false ) {
          getAvgTemp()
      }
  }, [isEligible])

  return isEligible ? (
      <div className="app">
          <h1>Temp check: How are you doing today?</h1>
          <Thumb temp={temp}/>
          <form onSubmit={(e) => handleSubmit(e)}>
              <label>Drag this sliderrr</label>
              <input type="range" min="-100" max="100" defaultValue={80} step="1" onChange={(e) => setTemp(e.target.value)}/>
              <button type="submit" disabled={isDisabled}>Submit</button>
          </form>
      </div>
  ) : (
      <div className="app">
          <h1>Avg temp: How are you doing today?</h1>
          <Thumb temp={avgTemp}/>
          <label>Global average temp:</label>
          <input type="range" min="-100" max="100" value={avgTemp} step="1" style={{pointerEvents: 'none'}}/>
          <p>Thx! Come back tmrw to submit again :)</p>
      </div>
  )
}

export default App;
