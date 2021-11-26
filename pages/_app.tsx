import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const Header = () => {
    return (
      <div className='headerContainer'>
        <h1
          style={{
            margin: 10,
            color: '#FFF',
            textShadow: '2px 2px 1px #000000',
          }}
        >
          drawing_app_devj.
        </h1>
      </div>
    )
  }

  return (
    <Fragment>
      <Header />
      <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
