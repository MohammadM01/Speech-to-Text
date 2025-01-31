import React from 'react'
import AudioRecorder from './Components/AudioRecorder'

const App = () => {
  return (
    <div className='w-full h-screen p-15 bg-zinc-800  '>
      <div className='text-white '>
        <AudioRecorder />
      </div>
    </div>
  )
}

export default App