import React from 'react'
import { StyledDisplay } from 'styles'

export const Display = ({ gameOver, text }) => {
  return <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
}
