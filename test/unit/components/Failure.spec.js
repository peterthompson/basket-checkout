import { assert } from 'chai'
import { shallow } from 'enzyme'
import React from 'react'
import Failure from '../../../app/js/components/Failure'

describe('Failure component', () => {
  it('should render a paragraph', () => {
    const wrapper = shallow(<Failure />);
    const p = wrapper.find('p');
    assert.equal(p.length, 1, `did not find a paragraph, found ${p.length}`)
  })
})
