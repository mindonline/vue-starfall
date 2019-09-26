export class Star {
  x
  y
  z
  size
  rotation

  constructor (x, y, z, size = 1.0, rotation = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.size = size
    this.rotation = rotation
  }
}
