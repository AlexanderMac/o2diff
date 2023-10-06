const original = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@mail.com',
  phones: [
    { type: 'home', value: '+12222' },
    { type: 'mobile', value: '+11111' }
  ]
}
const current = {
  firstName: 'Michael',
  age: 25,
  email: 'michael@mail.com',
  phones: [
    { type: 'work', value: '+13333' },
    { type: 'mobile', value: '+11111' }
  ],
  address: {
    city: 'New York',
    location: {
      latitude: 40.730610,
      longitude: -73.935242
    }
  }
}

function getObject(json) {
  try {
    return JSON.parse(json)
  } catch (err) {
    alert('Unable to parse JSON')
  }
}

function getJson(obj) {
  return JSON.stringify(obj, null, '    ')
}

const originalElem = document.getElementById('original')
const currentElem = document.getElementById('current')
const changesElem = document.getElementById('changes')
const diffValuesElem = document.getElementById('diff-values')
const diffPathsElem = document.getElementById('diff-paths')
const diffElem = document.getElementById('diff')

originalElem.value = getJson(original)
currentElem.value = getJson(current)

diffValuesElem.onclick = function() {
  const original = getObject(originalElem.value)
  const current = getObject(currentElem.value)
  const changes = o2diff.diffValues(original, current)
  changesElem.value = getJson(changes)
}

diffPathsElem.onclick = function() {
  const original = getObject(originalElem.value)
  const current = getObject(currentElem.value)
  const changes = o2diff.diffPaths(original, current)
  changesElem.value = getJson(changes)
}

diffElem.onclick = function() {
  const original = getObject(originalElem.value)
  const current = getObject(currentElem.value)
  const changes = o2diff.diff(original, current)
  changesElem.value = getJson(changes)
}
