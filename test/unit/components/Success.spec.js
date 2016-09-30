import assert from 'assert'
import React from 'react'
import Success from '../../../app/js/components/Success'
import { shallow } from 'enzyme'

describe('Success component', () => {
  it('should render a paragraph', () => {
    const wrapper = shallow(<Success />);
    const p = wrapper.find('p');
    assert.equal(p.length, 1, `did not find a paragraph, found ${p.length}`)
  })
})
