
// ---------------------------------------------------
// html admin things
// ---------------------------------------------------

var modal = document.getElementById('myModal')
var modalBody = document.getElementById('modalBody')
// Get the button that opens the modal
var btn = document.getElementById('openNavigation')
var downloadBtn = document.getElementById('downloadChronodex')
var addBtn = document.getElementById('add')

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block'
}

addBtn.onclick = function () {
  var tg = new TimeGap()
  tg.init(saveState)
  tg.addToLayer(layer)
  tg.addDragPoint(layer)
  segments.push(tg)
  saveState()
  printSegments()
}

downloadBtn.onclick = function () {
  downloadChronodex()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none'
  }
}

let formatHours = function (hours) {
  return hours + ' h'
}

var points = []

let createTitle = function (text, color, hours, index) {
  const defaultTitlePoint = {
    x: conf.titlePointX,
    y: conf.titlePointStartY + conf.titleStep * index,
    radius: conf.titlePointRadius,
    fillEnabled: true,
    fill: color,
    opacity: conf.opacity
  }
  var simpleText = new Konva.Text({
    x: conf.titlePointX + conf.titleTextXDelta,
    y: conf.titlePointStartY + conf.titleTexYDelta + conf.titleStep * index,
    text: text + (hours <= 9 ? ' ( ' : ' (') + formatHours(hours) + '.) ',
    fontSize: conf.titleTextFontSize,
    fontFamily: conf.titleTextFontFamily,
    fill: conf.black,
    opacity: 0.8
  })

  const titlePoint = new Konva.Circle(defaultTitlePoint)

  layer.add(titlePoint)
  layer.add(simpleText)
  layer.batchDraw()
  return { title: simpleText, point: titlePoint }
}

let printSegments = function () {
  modalBody.innerHTML = ''
  points.forEach(function (curr) {
    curr.point.remove()
    curr.title.remove()
  })
  points = []

  if (segments.length === 0) {
    const emptyState = document.createElement('div')
    emptyState.setAttribute('class', 'empty-state')
    emptyState.textContent = 'No segments yet'
    modalBody.appendChild(emptyState)
    return
  }

  segments.forEach(function (curr, index, arr) {
    let pointObj = createTitle(curr.title(), curr.color(), curr.hour(), index)
    points.push(pointObj)

    const lstItem = document.createElement('div')
    lstItem.setAttribute('class', 'segment-row')

    const colorPicker = document.createElement('input')
    colorPicker.setAttribute('type', 'color')
    colorPicker.setAttribute('id', 'picker-' + index)
    colorPicker.setAttribute('class', 'picker-input')
    colorPicker.setAttribute('value', curr.color())
    colorPicker.addEventListener('input', function (evt) {
      curr.color(this.value)
      pointObj.point.fill(this.value)
      saveState(true)
    })
    lstItem.appendChild(colorPicker)

    const title = document.createElement('input')
    title.setAttribute('type', 'text')
    title.setAttribute('value', curr.title())
    title.setAttribute('class', 'title-input')
    title.setAttribute('aria-label', 'Segment title')
    title.addEventListener('input', function () {
      curr.title(this.value)
      pointObj.title.text(
        this.value + (curr.hour() <= 9 ? ' ( ' : ' (') + formatHours(curr.hour()) + '.) '
      )
      saveState(true)
    })

    const titleField = document.createElement('label')
    titleField.setAttribute('class', 'segment-title-field')
    titleField.appendChild(title)
    lstItem.appendChild(titleField)

    const duration = document.createElement('span')
    duration.setAttribute('class', 'segment-duration')
    duration.textContent = formatHours(curr.hour())
    lstItem.appendChild(duration)

    const remBtn = document.createElement('button')
    remBtn.setAttribute('class', 'remove-button')
    remBtn.setAttribute('aria-label', 'Remove segment')
    remBtn.onclick = function () {
      curr.remove()
      segments.splice(index, 1)
      pointObj.point.remove()
      pointObj.title.remove()
      lstItem.remove()
      saveState()
      printSegments()
    }
    lstItem.appendChild(remBtn)

    modalBody.appendChild(lstItem)
  })
}

printSegments()
