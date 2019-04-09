'use strict';

const should = require('should');
const o2diff = require('../../');

describe('o2diff / main', () => {
  it('should call o2diff function', () => {
    let original = { id: 1 };
    let current = { id: 2 };

    let expected = {
      left: { id: 1 },
      right: { id: 2 }
    };
    let actual = o2diff(original, current, 'diff');
    should(actual).eql(expected);
  });
});
