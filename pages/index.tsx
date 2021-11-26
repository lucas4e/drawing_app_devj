import * as React from 'react'
import type { NextPage } from 'next'
import { useCanvas } from '../hooks/useCanvas'

const Home: NextPage = () => {
  const { isDrawing } = useCanvas()

  console.log(isDrawing)

  return (
    <React.Fragment>
      <div
        className='appContainer'
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '100px',
        }}
      >
        <div
          className='canvasContainer'
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <canvas
            id='canvas'
            style={{
              width: '1000px',
              height: '700px',
              marginRight: '50px',
              backgroundColor: '#FFF',
              borderRadius: '20px',
              boxShadow: '0 0px 20px #406e6f',
            }}
          ></canvas>
          <div
            className='toolbar'
            style={{
              width: '150px',
              height: '700px',
              backgroundColor: '#FFF',
              borderRadius: '20px',
              boxShadow: '0 0px 20px #406e6f',
            }}
          ></div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home
