import { assert } from 'chai'
import { shallow } from 'enzyme'
import React from 'react'
import { Link } from 'react-router'
import { routes } from '../../app/js/constants'
import PageNotFound from '../../app/js/components/PageNotFound'

const render = jsx => {
  const wrapper = shallow(jsx);
  const link = wrapper.find(Link);
  const p = wrapper.find('p');
  return { p, link }
}

describe('PageNotFound component', () => {
  it('should render a paragraph', () => {
    const { p } = render(<PageNotFound />);
    assert.equal(p.length, 1, `did not find a paragraph, found ${p.length}`)
  });
  it('should render a link to the Catalogue', () => {
    const { link } = render(<PageNotFound />);
    assert.equal(link.length, 1, `did not find a link, found ${link.length}`);
    assert.equal(link.prop('to'), routes.Catalogue, 'the link did not go the Catalogue')
  })
})
