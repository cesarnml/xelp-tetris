import React, { memo } from 'react'
import { StyledCell } from 'styles'
import { TETROMINOS } from 'utils'

let Cell = ({ type }) => (
  <StyledCell type={type} color={TETROMINOS[type].color} />
)

Cell = memo(Cell)

export { Cell }
