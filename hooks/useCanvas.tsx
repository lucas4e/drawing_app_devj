import * as React from 'react'

export function useCanvas() {
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false)

  React.useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const canvasContext = canvas?.getContext('2d')
  }, [])
}
