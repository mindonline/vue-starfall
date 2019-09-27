import { ImagePattern } from './Image.pattern'

export class CrossImagePattern extends ImagePattern {

  getImage () {
    return this.canvas
  }

  constructor (size = 16, color = '#eeeeff', shadow = 'blue') {
    super()

    this.size = size

    this.canvas = document.createElement('canvas')
    this.canvas.width = size
    this.canvas.height = size

    let ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5
    ctx.shadowBlur = size * 2
    ctx.shadowColor = shadow

    ctx.moveTo(0.5 * this.canvas.width, 0)
    ctx.lineTo(0.5 * this.canvas.width, 1 * this.canvas.height)

    ctx.moveTo(-1.0, 0.5 * size)
    ctx.lineTo(size, 0.5 * size)

    ctx.stroke()
  }
}
