import React from 'react'
import { StyledStartButton } from 'styles'

export const StartButton = ({ callback, text }) => {
  return <StyledStartButton onClick={callback}>{text}</StyledStartButton>
}
