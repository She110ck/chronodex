const conf = {
  with: window.innerWidth,
  height: window.innerHeight,
  white: '#f2f2f2',
  black: '2b3c4d',
  opacity: 0.6,
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
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}
// ---------------------------------------------------
let initClock = function () {
  for (let i = 0; i < 24; i++) {
    let dot = new Konva.Arc({
      x: conf.with / 2,
      y: conf.height / 2,
      stroke: conf.black,
      strokeWidth: 6,
      rotation: i * 15,
      innerRadius: conf.innerRadius - 4,
      outerRadius: conf.innerRadius + 4
    })

    let txt = new Konva.Text({
      x: conf.with / 2-2,
      y: conf.height / 2-4,
      fill: conf.black,
      text: (i + 12) % 24 || '0',
      fontSize: 20,
      fontFamily: 'Monospace',
      rotation: i * 15,
      offset: {
        x: 10,
        y: -conf.radius
      }
    })

    if (i % 6 == 0) {
      layer.add(dot)
    }
    layer.add(txt)
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

  layer.add(mainHand)
  layer.add(secondHand)
  layer.add(smallCircle)

  let anim = function (frame) {
    let now = new Date()
    let seconds = now.getSeconds()
    let hourBase = now.getHours() * 60 + now.getMinutes()
    mainHand.rotation(hourBase / 4)
    secondHand.rotation(seconds * 6)

    layer.batchDraw()
  }

  setInterval(anim, 250)
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
    this._title = values.title || 'Time segment ' + (segments.length + 1)
    // initialize before arc
    this._color = values.color || getRandomColor()
    this._hour = ((values.hour || 1) + 24) % 24

    // ---------------------------------------------------
    // should be centered every time
    const position = {
      x: conf.with / 2,
      y: conf.height / 2
    }
    // update non valid position
    if (values.arc) {
      values.arc.x = position.x
      values.arc.y = position.y
    }
    if (values.outerBorder) {
      values.outerBorder.x = position.x
      values.outerBorder.y = position.y
    }
    if (values.sideBorder) {
      values.sideBorder.x = position.x
      values.sideBorder.y = position.y
    }
    if (values.dragPoint) {
      values.dragPoint.x = position.x
      values.dragPoint.y = position.y
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
    this.arc = new Konva.Arc(values.arc || defaultArch)

    this.outerBorder = new Konva.Arc(values.outerBorder || defaultOuterBorder)

    this.sideBorder = new Konva.Arc(values.sideBorder || defaultSideBorder)

    this.dragPoint = new Konva.Circle(values.dragPoint || defaultDragPoint)
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
  items.segments.forEach(element => {
    var tg = new TimeGap(element)
    tg.init(saveState)
    tg.addToLayer(layer)
    segments.push(tg)
  })
  // just because I want drag points over everything
  segments.forEach(element => {
    element.addDragPoint(layer)
  })
})

layer.draw()

let saveState = function (dontRedraw=false) {
  const segmentsData = segments.map(x => x.serialize())
  if (segments.length == 0) {
    return false
  }
  // hacky, need to rethink
  if (!dontRedraw) {
    printSegments()

  } 

  chrome.storage.local.set({ segments: segmentsData }, function () {
    console.log('SAVED')
  })
}
// saveState()
