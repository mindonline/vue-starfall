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
      default: 30
    },
    starPattern: {
      type: Object,
      default () {
        return new StarImagePattern()
      }
    },
    fallXSpeed: {
      type: [Number],
      default: 0.07
    },
    fallYSpeed: {
      type: [Number],
      default: 0.1
    },
    rotationSpeed: {
      type: [Number],
      default: 5
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
      star.y = (star.y + relSpeed * this.fallYSpeed * this.feedbackDecay)
      if (star.y > 1 || star.x < 0) {
        star.y = 0
        star.x = Math.random() * 2
      }
      star.rotation = (star.rotation + relSpeed * this.rotationSpeed * this.feedbackDecay) % (Math.PI * 2)
    },
    drawStar (star) {
      let x = Math.floor(this.context.canvas.clientWidth * star.x)
      let y = Math.floor(this.context.canvas.clientHeight * star.y)

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
      this.context.fillStyle = 'rgba(255,255,255,0.2)'
      this.context.fillRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)

      this.stars.forEach(s => {
        this.drawStar(s)
        this.moveStar(s, time)
      })

      this.feedbackDecay += 0.01
      if (this.feedbackDecay > 1) this.feedbackDecay = 1
    },
    animationStart (lastTime = null) {
      this.animationId = window.requestAnimationFrame(time => {
        let relTime = lastTime ? time - lastTime : 0
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
        this.stars.push(
          new Star(
            Math.random(),
            Math.random(),
            Math.random(),
            this.generationMinSize + Math.random() * (this.generationMaxSize - this.generationMinSize),
            Math.random() * Math.PI * 2
          ))
      }
      this.stars.sort((a, b) => a.zIndex > b.zIndex ? 1 : -1)
    },
    fixCanvasSize () {
      if (this.context.canvas.width !== this.context.canvas.clientWidth) {
        this.context.canvas.width = this.context.canvas.clientWidth
      }
      if (this.context.canvas.height !== this.context.canvas.clientHeight) {
        this.context.canvas.height = this.context.canvas.clientHeight
      }
    },
    bindUserFeedback () {
      this.$refs.starfallContainer.addEventListener('mousemove', () => {
        this.decay()
      }, false)
    },
    decay () {
      this.feedbackDecay *= 0.98
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
      feedbackDecay: 1
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
