
// ---------------------------------------------------
// html admin things
// ---------------------------------------------------

var modal = document.getElementById('myModal')
var modalBody = document.getElementById('modalBody')
// Get the button that opens the modal
var btn = document.getElementById('openNavigation')
var addBtn = document.getElementById('add')
// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0]

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

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none'
  }
}

// ---------------------------------------------------
// Title list
// ---------------------------------------------------

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
    text: text + (hours <= 9 ? ' ( ' : ' (') + hours + ' h.) ',
    fontSize: conf.titleTextFontSize,
    fontFamily: conf.titleTextFontFamily,
    fill: conf.black,
    opacity: 0.8
  })

  titlePoint = new Konva.Circle(defaultTitlePoint)

  layer.add(titlePoint)
  layer.add(simpleText)
  layer.batchDraw()
  return { title: simpleText, point: titlePoint }
}

let printSegments = function () {
  modalBody.innerHTML = ''
  points.forEach(function (curr, index) {
    curr.point.remove()
    curr.title.remove()
  })
  points = []

  segments.forEach(function (curr, index, arr) {
    let pointObj = createTitle(curr.title(), curr.color(), curr.hour(), index)
    points.push(pointObj)
    const lstItem = document.createElement('div')
    const colorPicker = document.createElement('input')
    colorPicker.setAttribute('type', 'color')
    colorPicker.setAttribute('id', 'picker-' + index)
    colorPicker.setAttribute('class', 'picker-input')
    colorPicker.setAttribute('value', curr.color())
    colorPicker.addEventListener('input', function (evt) {
      curr.color(this.value)
      pointObj.point.fill(this.value)
      saveState(dontRedraw=true)
    })

    lstItem.appendChild(colorPicker)
    const title = document.createElement('input')
    title.setAttribute('type', 'text')
    title.setAttribute('value', curr.title())
    title.setAttribute('class', 'title-input')
    title.addEventListener('input', function () {
      curr.title(this.value)
      pointObj.title.text(
        this.value + (curr.hour() <= 9 ? ' ( ' : ' (') + curr.hour() + ' h.) '
      )
      saveState(dontRedraw=true)
    })
    lstItem.appendChild(title)

    const remBtn = document.createElement('button')
    remBtn.setAttribute('class', 'remove-button')
    remBtn.textContent = 'Remove'
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

