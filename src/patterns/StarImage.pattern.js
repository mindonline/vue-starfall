import { ImagePattern } from './Image.pattern'

export class StarImagePattern extends ImagePattern {
  canvas
  size

  getImage () {
    return this.canvas
  }

  constructor (size = 16, color = '#ccccff') {
    super()

    this.size = size

    this.canvas = document.createElement('canvas')
    this.canvas.width = size
    this.canvas.height = size

    const starPoints = [
      [0.5, 0],
      [0.85, 1.0],
      [0.0, 0.4],
      [1.0, 0.4],
      [0.15, 1.0]
    ]

    let ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    starPoints.reduce((previousValue, currentValue) => {
      if (previousValue) {
        ctx.lineTo(currentValue[0] * this.canvas.width, currentValue[1] * this.canvas.height)
      } else {
        ctx.moveTo(currentValue[0] * this.canvas.width, currentValue[1] * this.canvas.height)
      }
      return currentValue
    }, null)
    ctx.closePath()
    ctx.stroke()
  }
}
