<template>
  <div class="starfall-container" ref="starfallContainer" :style="containerStyle">
    <div class="canvas-container">
      <canvas ref="playground">
        Require canvas support
      </canvas>
    </div>
    <div class="slot-container">
      <slot/>
    </div>
  </div>
</template>

<script>
import { Star } from '../classes/star'
import { StarImagePattern } from '../patterns/StarImage.pattern'
// import { CrossImagePattern } from '../patterns/CrossImage.pattern'

export default {
  name: 'VueStarfall',

  props: {
    width: {
      type: [String],
      default: '200px'
    },
    height: {
      type: [String],
      default: '200px'
    },
    maxStars: {
      type: [Number],
      default: 60
    },
    starPattern: {
      type: Object,
      default () {
        return new StarImagePattern()
      }
    },
    fallXSpeed: {
      type: [Number],
      default: 0.01
    },
    fallYSpeed: {
      type: [Number],
      default: 0.02
    },
    rotationSpeed: {
      type: [Number],
      default: 2
    },
    generationMinSize: {
      type: [Number],
      default: 0.2
    },
    generationMaxSize: {
      type: [Number],
      default: 1.0
    },
    userFeedback: {
      type: Boolean,
      default: false
    },
    decaySpeed: {
      type: [Number],
      default: 0.95
    },
    decayRestoreSpeed: {
      type: [Number],
      default: 1.05
    },
    backgroundColor: {
      type: String,
      default: 'rgba(0,0,0,0.2)'
    }
  },

  computed: {
    containerStyle () {
      return {
        width: this.width,
        height: this.height
      }
    }
  },

  methods: {
    moveStar (star, relSpeed) {
      star.x = (star.x - relSpeed * this.fallXSpeed * this.feedbackDecay)
      star.y = (star.y + relSpeed * this.fallYSpeed * (1.0 + star.z) * this.feedbackDecay)
      if (star.y > 1 || star.x < 0) {
        star.y = 0
        star.x = Math.random() * 2
      }
      star.rotation = (star.rotation + relSpeed * this.rotationSpeed * this.feedbackDecay) % (Math.PI * 2)
    },
    drawStar (star) {
      let x = Math.floor(this.context.canvas.clientWidth * star.x)
      let y = Math.floor(this.context.canvas.clientHeight * star.y)

      if (this.userFeedback) {
        x += this.shiftX * star.z * 100
        y += this.shiftY * star.z * 100
      }

      this.context.fillStyle = this.starImagePattern
      this.context.save()
      this.context.translate(x + this.starPattern.size / 2, y + this.starPattern.size / 2)
      this.context.rotate(star.rotation)
      this.context.translate(-this.starPattern.size / 2, -this.starPattern.size / 2)
      this.context.scale(star.size, star.size)
      this.context.fillRect(0, 0, this.starPattern.size, this.starPattern.size)
      this.context.restore()
    },
    animationInit () {
      this.context = this.$refs.playground.getContext('2d')
      this.starImagePattern = this.context.createPattern(this.starPattern.getImage(), 'no-repeat')
    },
    animationStep (time) {
      this.context.fillStyle = this.backgroundColor
      this.context.fillRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)

      this.stars.forEach(s => {
        this.drawStar(s)
        this.moveStar(s, time)
      })

      if (this.userFeedback) {
        this.restoreDecay()
      }
    },
    animationStart (lastTime = null) {
      this.animationId = window.requestAnimationFrame(time => {
        let relTime = Math.min(lastTime ? time - lastTime : 0, 1000 / 5)
        let stepTime = relTime / 1000
        this.fixCanvasSize()
        this.animationStep(stepTime)
        this.animationStart(time)
      })
    },
    animationPause () {
      window.cancelAnimationFrame(this.animationId)
    },
    seedStars () {
      this.stars.length = 0
      for (let i = 0; i < this.maxStars; i++) {
        let z = Math.random()
        this.stars.push(
          new Star(
            Math.random(),
            Math.random(),
            z,
            this.generationMinSize + z * (this.generationMaxSize - this.generationMinSize),
            Math.random() * Math.PI * 2
          ))
      }
      this.stars.sort((a, b) => a.zIndex > b.zIndex ? 1 : -1)
    },
    fixCanvasSize () {
      if (this.context.canvas.width !== this.context.canvas.clientWidth && this.context.canvas.clientWidth !== 0) {
        this.context.canvas.width = this.context.canvas.clientWidth
      }
      if (this.context.canvas.height !== this.context.canvas.clientHeight && this.context.canvas.clientHeight !== 0) {
        this.context.canvas.height = this.context.canvas.clientHeight
      }
    },
    bindUserFeedback () {
      this.$refs.starfallContainer.addEventListener('mouseleave', (e) => {
        this.mouseX = this.mouseY = null
      })

      this.$refs.starfallContainer.addEventListener('mousemove', (e) => {
        this.decay()
        if (this.mouseX !== null) {
          this.shiftX += (e.clientX - this.mouseX) / this.context.canvas.width
        }
        if (this.mouseY !== null) {
          this.shiftY += (e.clientY - this.mouseY) / this.context.canvas.height
        }
        this.mouseX = e.clientX
        this.mouseY = e.clientY
      }, false)
    },
    decay () {
      this.feedbackDecay = Math.max(this.decaySpeed * this.feedbackDecay, 0.15)
    },
    restoreDecay () {
      this.shiftX *= 0.999
      this.shiftY *= 0.999

      this.feedbackDecay = Math.min(this.feedbackDecay * this.decayRestoreSpeed, 1.0)
    }
  },

  mounted () {
    this.seedStars()
    this.animationInit()
    this.animationStart()
    this.bindUserFeedback()
  },

  data () {
    return {
      context: null,
      animationId: null,
      stars: [],
      starImagePattern: null,
      starImagePatternSize: null,
      feedbackDecay: 1,
      mouseX: null,
      mouseY: null,
      shiftX: 0,
      shiftY: 0
    }
  }
}
</script>

<style scoped>
  .starfall-container {
    position: relative;
    min-height: 100px;
    min-width: 100px;
  }

  .canvas-container {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  .canvas-container canvas {
    width: 100%;
    height: 100%
  }

  .slot-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
