import React from 'react'
import { StyledStartButton } from 'styles'

export const StartButton = ({ callback }) => {
  return <StyledStartButton onClick={callback}>Start Game</StyledStartButton>
}
