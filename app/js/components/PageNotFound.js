import React from 'react'
import { Link } from 'react-router'
import { routes } from '../constants'

export default () => (
  <div>
    <p>Page Not Found</p>
    <Link to={routes.Catalogue}>Continue Shopping</Link>
  </div>
)
