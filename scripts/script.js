const conf = {
  with: window.innerWidth,
  height: window.innerHeight,
  white: '#f2f2f2',
  black: '#2b3c4d',
  opacity: 0.6,
  amBackground: '#1f2f3f',
  pmBackground: '#e5ebe6',
  radiusScale: 3,
  strokeWidth: 4,
  get radius () {
    return Math.min(this.with, this.height) / this.radiusScale
  },
  hourAngle: 15,
  selectColor: '#FF0000',
  deselectColor: '#111111',
  dragPointRadius: 10,
  dragPointStroke: 4,
  innerRadius: 200,
  innerRadiusLimit: 40,
  titlePointX: 64,
  titlePointStartY: 100,
  titlePointRadius: 14,
  titleStep: 40,
  titleTextXDelta: 30,
  get titleTexYDelta () {
    return this.titleTextFontSize / -2 + 3
  },
  titleTextFontSize: 18,
  titleTextFontFamily: 'Arial'
}

const degToRad = function (degrees) {
  return degrees * Math.PI / 180
}

const clockRotationForHour = function (hour) {
  return ((hour - 12 + 24) % 24) * conf.hourAngle
}

const clockPoint = function (hour, radius) {
  const radians = degToRad(clockRotationForHour(hour) - 90)

  return {
    x: conf.with / 2 + Math.cos(radians) * radius,
    y: conf.height / 2 + Math.sin(radians) * radius
  }
}

// ---------------------------------------------------
const layer = new Konva.Layer()
const stage = new Konva.Stage({
  container: 'container',
  width: conf.with,
  height: conf.height,
  fill: conf.white
})

// stage.getContainer().style.backgroundColor = conf.white

const background = new Konva.Rect({
  x: 0,
  y: 0,
  width: conf.with,
  height: conf.height,
  fill: conf.white
})
layer.add(background)

stage.add(layer)

const getRandomColor = function () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}
// ---------------------------------------------------
var clockNodes = []
var clockInterval

const addClockNode = function (node) {
  clockNodes.push(node)
  layer.add(node)
  return node
}

const clearClock = function () {
  if (clockInterval) {
    clearInterval(clockInterval)
  }

  clockNodes.forEach(node => node.remove())
  clockNodes = []
}

let initClock = function () {
  clearClock()

  const clockCenter = {
    x: conf.with / 2,
    y: conf.height / 2
  }

  const amBand = new Konva.Arc({
    x: clockCenter.x,
    y: clockCenter.y,
    innerRadius: conf.innerRadius - 28,
    outerRadius: conf.radius + 26,
    angle: 180,
    rotation: 90,
    fill: conf.amBackground,
    opacity: 0.12
  })

  const pmBand = new Konva.Arc({
    x: clockCenter.x,
    y: clockCenter.y,
    innerRadius: conf.innerRadius - 28,
    outerRadius: conf.radius + 26,
    angle: 180,
    rotation: -90,
    fill: conf.pmBackground,
    opacity: 0.66
  })

  addClockNode(pmBand)
  addClockNode(amBand)

  for (let i = 0; i < 24; i++) {
    const hour = (i + 12) % 24
    const rotation = clockRotationForHour(hour)
    const textPosition = clockPoint(hour, conf.radius)

    let dot = new Konva.Arc({
      x: conf.with / 2,
      y: conf.height / 2,
      stroke: conf.black,
      strokeWidth: 6,
      rotation: rotation,
      innerRadius: conf.innerRadius - 4,
      outerRadius: conf.innerRadius + 4
    })

    let txt = new Konva.Text({
      x: textPosition.x,
      y: textPosition.y,
      fill: conf.black,
      text: hour || '0',
      fontSize: 20,
      fontFamily: 'Monospace',
      offset: {
        x: 10,
        y: 10
      }
    })

    if (i % 6 == 0) {
      addClockNode(dot)
    }
    addClockNode(txt)
  }

  let mainHand = new Konva.Rect({
    x: conf.with / 2,
    y: conf.height / 2,
    width: 4,
    height: -(conf.radius / 1.75),
    fill: conf.black
    // offset: { x: 0, y: 30 }
  })
  let secondHand = new Konva.Rect({
    x: conf.with / 2,
    y: conf.height / 2,
    width: 2,
    height: -conf.radius,
    fill: conf.black

    // offset: { x: 0, y: 50 }
  })

  let smallCircle = new Konva.Circle({
    x: conf.with / 2,
    y: conf.height / 2,
    radius: 15,
    fillEnabled: true,
    fill: conf.black,
    strokeWidth: conf.strokeWidth,
    stroke: conf.white,
    opacity: 1
  })

  addClockNode(mainHand)
  addClockNode(secondHand)
  addClockNode(smallCircle)

  let anim = function (frame) {
    let now = new Date()
    let seconds = now.getSeconds()
    let hourBase = now.getHours() + now.getMinutes() / 60
    mainHand.rotation(clockRotationForHour(hourBase))
    secondHand.rotation(seconds * 6)

    layer.batchDraw()
  }

  anim()
  clockInterval = setInterval(anim, 250)
}

initClock()

// ---------------------------------------------------
/** days
 * 1
 * 2
 * 3
 * 4
 * 5
 * 6
 * 7
 */

var segments = []
var points = []
class TimeGap {
  constructor (values = {}) {
    this._title = values.title === undefined ? 'Time segment ' + (segments.length + 1) : values.title
    // initialize before arc
    this._color = values.color || getRandomColor()
    this._hour = ((values.hour === undefined ? 1 : values.hour) + 24) % 24

    // ---------------------------------------------------
    // should be centered every time
    const position = {
      x: conf.with / 2,
      y: conf.height / 2
    }

    const restoreShapeAttrs = function (shape) {
      if (!shape) return undefined

      return Object.assign({}, shape.attrs || shape, position)
    }

    // default values
    const defaultArch = {
      x: position.x,
      y: position.y,
      innerRadius: conf.innerRadius,
      outerRadius: conf.radius,
      angle: this._hour * conf.hourAngle,
      fill: this._color,
      opacity: conf.opacity
    }

    const defaultOuterBorder = Object.assign({}, defaultArch, {
      stroke: conf.black,
      strokeWidth: conf.strokeWidth,
      fillEnabled: false,
      innerRadius: conf.radius
    })

    const defaultSideBorder = Object.assign({}, defaultArch, {
      stroke: conf.black,
      strokeWidth: conf.strokeWidth,
      fillEnabled: false,
      angle: 0,
      rotation: this._hour * conf.hourAngle
    })
    const defaultDragPoint = {
      x: position.x,
      y: position.y,
      radius: conf.dragPointRadius,
      stroke: conf.black,
      strokeWidth: conf.dragPointStroke,
      fillEnabled: true,
      fill: conf.white,
      opacity: 1,
      rotation: this._hour * conf.hourAngle,
      offset: {
        x: -conf.radius,
        y: 0
      }
    }
    // ---------------------------------------------------
    this.arc = new Konva.Arc(restoreShapeAttrs(values.arc) || defaultArch)

    this.outerBorder = new Konva.Arc(restoreShapeAttrs(values.outerBorder) || defaultOuterBorder)

    this.sideBorder = new Konva.Arc(restoreShapeAttrs(values.sideBorder) || defaultSideBorder)

    this.dragPoint = new Konva.Circle(restoreShapeAttrs(values.dragPoint) || defaultDragPoint)
  }

  distance (p1, p2) {
    return Math.max(
      Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)),
      conf.innerRadiusLimit
    )
  }

  getAngle () {
    const center = this.arc.position()
    const pointer = stage.getPointerPosition()
    // counting angle
    const angle = (function (p1, p2) {
      var deltaX = p2.x - p1.x
      var deltaY = p2.y - p1.y
      var rad = Math.atan2(deltaY, deltaX)
      return rad * (180 / Math.PI) + 5
    })(center, pointer)

    const slice = 15
    return Math.floor(angle / slice) * slice
  }

  init (savefunc) {
    // outer border
    this.outerBorder.on('mouseenter', () => {
      this.outerBorder.stroke(conf.selectColor)
      layer.batchDraw()
    })

    this.outerBorder.on('mouseleave', () => {
      this.outerBorder.stroke(conf.deselectColor)
      layer.batchDraw()
    })

    this.outerBorder.on('mousedown', () => {
      // attach move event
      stage.on('mousemove.resizer', () => {
        const center = this.outerBorder.position()
        const pointer = stage.getPointerPosition()
        const radius = this.distance(center, pointer)

        this.outerBorder.outerRadius(radius)
        this.outerBorder.innerRadius(radius)
        this.arc.outerRadius(radius)
        this.sideBorder.outerRadius(radius)
        this.dragPoint.offset({ x: -radius, y: 0 })

        layer.batchDraw()
      })

      // remove all events at end
      stage.on('mouseup.resizer', () => {
        stage.off('.resizer')
        this.outerBorder.stroke(conf.deselectColor)
        savefunc()
      })
    })

    // side border
    this.sideBorder.on('mouseenter', () => {
      this.sideBorder.stroke(conf.selectColor)
      layer.batchDraw()
    })

    this.sideBorder.on('mouseleave', () => {
      this.sideBorder.stroke(conf.deselectColor)
      layer.batchDraw()
    })

    this.sideBorder.on('mousedown', () => {
      // attach move event

      stage.on('mousemove.resizer', () => {
        this.arc.angle(this.getAngle() - this.arc.rotation())
        this.outerBorder.angle(this.getAngle() - this.arc.rotation())
        this.dragPoint.rotation(this.getAngle())
        this.sideBorder.rotation(this.getAngle())
        this.hour(this.arc.angle() / conf.hourAngle)

        layer.batchDraw()
      })

      // remove all events at end
      stage.on('mouseup.resizer', () => {
        stage.off('.resizer')
        this.sideBorder.stroke(conf.deselectColor)
        savefunc()
      })
    })

    // drag point
    this.dragPoint.on('mouseenter', () => {
      this.dragPoint.stroke(conf.selectColor)
      layer.batchDraw()
    })

    this.dragPoint.on('mouseleave', () => {
      this.dragPoint.stroke(conf.deselectColor)
      layer.batchDraw()
    })

    this.dragPoint.on('mousedown', () => {
      // attach move event
      // let prev =
      stage.on('mousemove.resizer', () => {
        this.arc.rotation(this.getAngle() - this.arc.angle())
        this.outerBorder.rotation(this.getAngle() - this.arc.angle())
        this.dragPoint.rotation(this.getAngle())
        this.sideBorder.rotation(this.getAngle())

        layer.batchDraw()
      })

      // remove all events at end
      stage.on('mouseup.resizer', () => {
        stage.off('.resizer')
        this.dragPoint.stroke(conf.deselectColor)
        savefunc()
      })
    })
  }

  addToLayer (layer) {
    layer.add(this.arc)
    layer.add(this.outerBorder)
    layer.add(this.sideBorder)
    // layer.add(this.dragPoint)
  }
  addDragPoint (layer) {
    layer.add(this.dragPoint)
  }

  remove () {
    this.arc.remove()
    this.outerBorder.remove()
    this.sideBorder.remove()
    this.dragPoint.remove()
    layer.batchDraw()
  }

  hour (arg) {
    if (arg === undefined) return this._hour
    let positiveAngle = (arg * conf.hourAngle +720) % 360
    this.arc.angle(positiveAngle)
    this._hour = positiveAngle/conf.hourAngle
    layer.batchDraw()
  }

  color (arg) {
    if (arg === undefined) return this._color

    this._color = arg
    this.arc.fill(arg)
    layer.batchDraw()
  }

  title (arg) {
    if (arg === undefined) return this._title

    this._title = arg
    // TODO:
    layer.batchDraw()
  }

  serialize () {
    return {
      title: this._title,
      color: this._color,
      hour: this._hour,
      arc: this.arc.toObject(),
      outerBorder: this.outerBorder.toObject(),
      sideBorder: this.sideBorder.toObject(),
      dragPoint: this.dragPoint.toObject()
    }
  }
}
// ---------------------------------------------------

chrome.storage.local.get(['segments'], function (items) {
  const storedSegments = Array.isArray(items.segments) ? items.segments : []

  storedSegments.forEach(element => {
    var tg = new TimeGap(element)
    tg.init(saveState)
    tg.addToLayer(layer)
    segments.push(tg)
  })
  // just because I want drag points over everything
  segments.forEach(element => {
    element.addDragPoint(layer)
  })

  if (typeof printSegments === 'function') {
    printSegments()
  }
})

layer.draw()

let saveState = function (dontRedraw=false) {
  const segmentsData = segments.map(x => x.serialize())
  // hacky, need to rethink
  if (!dontRedraw) {
    printSegments()
  }

  chrome.storage.local.set({ segments: segmentsData }, function () {
    console.log('SAVED')
  })
}
// saveState()

let resizeTimer
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(function () {
    const segmentsData = segments.map(x => x.serialize())

    points.forEach(function (curr) {
      curr.point.remove()
      curr.title.remove()
    })
    points = []

    segments.forEach(function (segment) {
      segment.remove()
    })
    segments = []

    conf.with = window.innerWidth
    conf.height = window.innerHeight
    stage.width(conf.with)
    stage.height(conf.height)
    background.width(conf.with)
    background.height(conf.height)

    initClock()

    segmentsData.forEach(function (data) {
      const tg = new TimeGap(data)
      tg.init(saveState)
      tg.addToLayer(layer)
      segments.push(tg)
    })
    segments.forEach(function (segment) {
      segment.addDragPoint(layer)
    })

    printSegments()
    saveState(true)
    layer.draw()
  }, 120)
})

const exportChronodexDataUrl = function () {
  return stage.toDataURL({
    pixelRatio: 2,
    mimeType: 'image/png'
  })
}

const downloadChronodex = function () {
  const link = document.createElement('a')
  link.download = 'chronodex.png'
  link.href = exportChronodexDataUrl()
  document.body.appendChild(link)
  link.click()
  link.remove()
}
