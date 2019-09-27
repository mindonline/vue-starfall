import { ImagePattern } from './Image.pattern'

export class SquareImagePattern extends ImagePattern {

  getImage () {
    return this.canvas
  }

  constructor (size = 7, color = '#ccccff') {
    super()

    this.size = size

    this.canvas = document.createElement('canvas')
    this.canvas.width = size
    this.canvas.height = size

    let ctx = this.canvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = Math.max(size / 6, 2)
    ctx.rect(0, 0, size, size)
    ctx.stroke()
  }
}
