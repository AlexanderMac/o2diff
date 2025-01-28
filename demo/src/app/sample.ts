const original = {
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@mail.com',
  phones: [
    { type: 'home', value: '+12222' },
    { type: 'mobile', value: '+11111' },
  ],
}

const current = {
  firstName: 'Michael',
  age: 25,
  email: 'michael@mail.com',
  phones: [
    { type: 'work', value: '+13333' },
    { type: 'mobile', value: '+11111' },
  ],
  address: {
    city: 'New York',
    location: {
      latitude: 40.73061,
      longitude: -73.935242,
    },
  },
}

export const sample = {
  original,
  current,
}
