import * as React from 'react'
import type { NextPage } from 'next'
import { useCanvas } from '../hooks/useCanvas'

const Home: NextPage = () => {
  const [canvas, setCanvas] = React.useState<HTMLElement | null>(null)
  const {} = useCanvas(canvas as HTMLElement)

  React.useEffect(() => {
    setCanvas(document?.getElementById('canvas'))
  }, [])

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
          style={{
            display: 'flex',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <canvas
            id='canvas'
            style={{
              width: '1000px',
              height: '700px',
              backgroundColor: '#FFF',
              borderRadius: '20px',
              boxShadow: '0 0px 20px #406e6f',
            }}
          ></canvas>
          {/* <div
            className='toolbar'
            style={{
              width: '150px',
              height: '700px',
              backgroundColor: '#FFF',
              borderRadius: '20px',
              boxShadow: '0 0px 20px #406e6f',
            }}
          ></div> */}
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home
