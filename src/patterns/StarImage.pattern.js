import { ImagePattern } from './Image.pattern'

export class StarImagePattern extends ImagePattern {

  getImage () {
    return this.canvas
  }

  constructor (size = 16, color = '#eeeeff', shadow = 'blue') {
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
    ctx.lineWidth = 1.5
    ctx.shadowBlur = size * 2
    ctx.shadowColor = shadow

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
