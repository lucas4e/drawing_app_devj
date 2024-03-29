import * as React from 'react'
import type { NextPage } from 'next'
import CanvasDraw from 'react-canvas-draw'
import { BlockPicker } from 'react-color'
import {
  MdOutlineGridOff,
  MdOutlineGridOn,
  MdDelete,
  MdUndo,
  MdSave,
  MdCloudDownload,
  MdBrush,
  MdDownload,
} from 'react-icons/md'

const Home: NextPage = () => {
  const defaultProps = {
    onChange: null,
    loadTimeOffset: 5,
    lazyRadius: 1,
    brushRadius: 10,
    brushColor: '#697689',
    catenaryColor: '#0a0302',
    hideGrid: true,
    gridColor: 'rgba(150,150,150,0.17)',
    gridSizeX: 25,
    gridSizeY: 25,
    gridLineWidth: 0.5,
    hideGridX: false,
    hideGridY: false,
    disabled: false,
    imgSrc: '',
    immediateLoading: false,
    hideInterface: false,
    enablePanAndZoom: false,
    mouseZoomFactor: 0.01,
    zoomExtents: { min: 0.33, max: 3 },
  }

  //Declared here to prevent ts(2448)
  const [canvasProps, setCanvasProps] = React.useState(defaultProps)
  const [brushRadiusPickerVisible, setBrushRadiusPickerVisible] =
    React.useState(false)
  const [pickerVisible, setPickerVisible] = React.useState(false)
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [infoMessage, setInfoMessage] = React.useState({ type: '', name: '' })
  const canvasRef = React.useRef<any>(null)
  const popupRef = React.useRef<any>(null)
  const brushRadiusConstraints = {
    max: 200,
    min: 2,
  }
  const fileType = 'png'
  const useBgImage = false
  const backgroundColour = '#FFF'

  function handlePickerChange(color: any) {
    setCanvasProps({ ...canvasProps, brushColor: color })
    setPickerVisible(!pickerVisible)
  }

  function handleUndo(event: any) {
    if (event.ctrlKey && event.keyCode === 90) {
      canvasRef.current!.undo()
    }
  }

  function handleEraseAll() {
    canvasRef.current!.eraseAll()
  }

  function handleSave() {
    const canvasName = window.prompt(
      'Please give your masterpiece a name!',
      'my masterpiece'
    )
    if (!canvasName) return
    const canvasObj = {
      ctxString: canvasRef.current.getSaveData(),
      ctxName: canvasName,
    }
    localStorage.setItem('savedCanvas', JSON.stringify(canvasObj))
    localStoragePopup('saving', canvasObj.ctxName)
  }

  function handleLoad() {
    const savedData = localStorage.getItem('savedCanvas')
    const savedDataJSON = JSON.parse(savedData as string)

    if (savedData) {
      canvasRef.current.loadSaveData(savedDataJSON.ctxString)
      localStoragePopup('loading', savedDataJSON.ctxName)
    }
  }

  function handleExport() {
    const file = canvasRef.current.getDataURL(
      fileType,
      useBgImage,
      backgroundColour
    )
    const savedData = localStorage.getItem('savedCanvas')
    const savedDataJSON = JSON.parse(savedData as string)
    const element = document.createElement('a')
    element.setAttribute('href', file)
    element.setAttribute('download', file)
    element.download = savedDataJSON?.ctxName || 'artwork'
    element.click()
    element.remove()
  }

  function localStoragePopup(type: string, name: string) {
    setInfoMessage({ type: type, name: name })
    if (!popupRef.current?.classList.contains('showPopup')) {
      popupRef.current?.classList.add('showPopup')
      setTimeout(() => {
        popupRef.current?.classList.remove('showPopup')
      }, 2000)
    }
  }

  function restrictBrushRadiusResize(event: any) {
    setIsDrawing(event.buttons === 1)
  }

  const setBrushRadiusConstraints = React.useCallback(() => {
    if (canvasProps.brushRadius <= brushRadiusConstraints.min) {
      setCanvasProps({
        ...canvasProps,
        brushRadius: brushRadiusConstraints.min,
      })
    }

    if (canvasProps.brushRadius >= brushRadiusConstraints.max) {
      setCanvasProps({
        ...canvasProps,
        brushRadius: brushRadiusConstraints.max,
      })
    }
  }, [canvasProps, brushRadiusConstraints.min, brushRadiusConstraints.max])

  const handleRadiusChange = React.useCallback(
    event => {
      let resize
      let tick = 2
      event.deltaY > 0
        ? (resize = canvasProps.brushRadius -= tick)
        : (resize = canvasProps.brushRadius += tick)

      if (!isDrawing) {
        setCanvasProps({
          ...canvasProps,
          brushRadius: resize,
        })
      }
      setBrushRadiusConstraints()
    },
    [canvasProps, setBrushRadiusConstraints, isDrawing]
  )

  const closeOptionsMenu = React.useCallback(() => {
    if (pickerVisible) {
      setPickerVisible(false)
    } else if (brushRadiusPickerVisible) {
      setBrushRadiusPickerVisible(false)
    } else return
  }, [pickerVisible, brushRadiusPickerVisible])

  React.useEffect(() => {
    const canvasEl = document.getElementById('canvasEl')

    document?.addEventListener('keydown', handleUndo)
    canvasEl?.addEventListener('wheel', handleRadiusChange)
    canvasEl?.addEventListener('click', closeOptionsMenu)
    canvasEl?.addEventListener('mousemove', restrictBrushRadiusResize)

    return () => {
      document?.removeEventListener('keydown', handleUndo)
      canvasEl?.removeEventListener('wheel', handleRadiusChange)
      canvasEl?.removeEventListener('click', closeOptionsMenu)
      canvasEl?.removeEventListener('mousemove', restrictBrushRadiusResize)
    }
  }, [canvasRef, closeOptionsMenu, handleRadiusChange])

  return (
    <React.Fragment>
      <div
        className='appContainer'
        id='appContainer'
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '60px',
        }}
      >
        <div
          className='settingsContainer'
          style={{
            padding: '5px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.5rem',
            backgroundColor: '#558E90',
            width: '600px',
          }}
        >
          <button
            style={{ display: 'contents', cursor: 'pointer' }}
            onClick={() => {
              setBrushRadiusPickerVisible(!brushRadiusPickerVisible)
              setPickerVisible(false)
            }}
          >
            <MdBrush style={{ width: '30px', height: '30px' }} />
          </button>
          {brushRadiusPickerVisible && (
            <div
              style={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '108px',
                marginRight: '445px',
                width: '200px',
                height: '50px',
                backgroundColor: '#FFF',
                borderRadius: '5px',
                boxShadow: '0px 1px 1px #E5E5E5',
                zIndex: '10000',
              }}
            >
              <div style={{ marginTop: '1rem' }}>
                <input
                  type='range'
                  value={canvasProps.brushRadius}
                  min={brushRadiusConstraints.min}
                  max={brushRadiusConstraints.max}
                  id='brushRadiusSlider'
                  onChange={e =>
                    setCanvasProps({
                      ...canvasProps,
                      brushRadius: parseInt(e.target.value),
                    })
                  }
                ></input>
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: '25px',
                  height: '25px',
                  backgroundColor: '#FFF',
                  marginTop: '-5px',
                  transform: 'rotate(45deg)',
                  zIndex: '-100',
                }}
              ></div>
            </div>
          )}
          <button
            style={{
              width: '30px',
              height: '30px',
              marginLeft: '2rem',
              borderRadius: '50%',
              backgroundColor: canvasProps.brushColor,
              border: '2.5px solid #000000',
              cursor: 'pointer',
            }}
            onClick={() => {
              setPickerVisible(!pickerVisible)
              setBrushRadiusPickerVisible(false)
            }}
          ></button>
          {pickerVisible && (
            <div
              className='pickerContainer'
              style={{
                position: 'absolute',
                marginTop: '275px',
                marginRight: '312px',
                zIndex: '1000',
              }}
            >
              <BlockPicker
                color={canvasProps.brushColor}
                onChangeComplete={color => handlePickerChange(color.hex)}
              />
            </div>
          )}
          <div style={{ marginLeft: '2rem' }}>
            <button
              style={{ display: 'contents', cursor: 'pointer' }}
              onClick={() =>
                setCanvasProps({
                  ...canvasProps,
                  hideGrid: !canvasProps.hideGrid,
                })
              }
            >
              {canvasProps.hideGrid ? (
                <MdOutlineGridOn size='32px' />
              ) : (
                <MdOutlineGridOff size='32px' />
              )}
            </button>
            <button
              style={{
                display: 'contents',
                cursor: 'pointer',
              }}
            >
              <MdUndo
                style={{ width: '30px', height: '30px', marginLeft: '2rem' }}
                onClick={() => canvasRef.current!.undo()}
              />
            </button>
            <button
              style={{
                display: 'contents',
                cursor: 'pointer',
              }}
            >
              <MdDelete
                style={{ width: '30px', height: '30px', marginLeft: '2rem' }}
                // onClick={() => canvasRef.current!.eraseAll()}
                onClick={handleEraseAll}
              />
            </button>
            <button style={{ display: 'contents', cursor: 'pointer' }}>
              <MdSave
                style={{ width: '30px', height: '30px', marginLeft: '2rem' }}
                onClick={handleSave}
              />
            </button>
            <button style={{ display: 'contents', cursor: 'pointer' }}>
              <MdCloudDownload
                style={{ width: '30px', height: '30px', marginLeft: '2rem' }}
                onClick={handleLoad}
              />
            </button>
            <button style={{ display: 'contents', cursor: 'pointer' }}>
              <MdDownload
                style={{ width: '30px', height: '30px', marginLeft: '2rem' }}
                onClick={handleExport}
              />
            </button>
          </div>
        </div>
        <div
          id='canvasEl'
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CanvasDraw
            ref={canvasRef}
            style={{
              cursor: 'none',
              width: '80vw',
              height: '75vh',
            }}
            {...canvasProps}
          />
        </div>
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            bottom: 0,
            overflow: 'hidden',
            marginBottom: '-50px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#FFF',
            fontSize: '22px',
            transition: '150ms',
          }}
        >{`${infoMessage.type} artwork "${infoMessage.name}"`}</div>
      </div>
    </React.Fragment>
  )
}

export default Home
