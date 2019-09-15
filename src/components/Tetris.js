import React, { useState } from 'react'
import { Stage, Display, StartButton } from 'components'
import { createStage, checkCollision } from 'utils'
import styled from 'styled-components'
import { usePlayer, useStage, useGameStatus, useInterval } from 'hooks'
import tetris from 'assets/audio/tetris.ogg'
import bgImage from 'assets/images/bg.png'
const audio = new Audio(tetris)

export const Tetris = () => {
  const [dropTime, setDropTime] = useState(null)
  const [isOn, setOn] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameAudio, setAudio] = useState(false)
  const [isPaused, setPaused] = useState(false)
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer()
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer)
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
    rowsCleared
  )

  const handleAudio = () => {
    if (!gameAudio) {
      audio.play()
      setAudio(true)
    } else {
      audio.pause()
      setAudio(false)
    }
  }

  const handlePause = () => {
    if (isPaused) {
      setDropTime(1000)
      handleAudio()
    } else {
      handleAudio()
      setDropTime(null)
    }
    setPaused(prev => !prev)
  }

  const startGame = () => {
    // reset everything
    setStage(createStage())
    setDropTime(1000)
    setOn(true)
    resetPlayer()
    setGameOver(false)
    setScore(0)
    setRows(0)
    setLevel(0)
    handleAudio()
  }

  const movePlayer = dir => {
    if (isPaused) {
      return
    }
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 })
    }
  }

  const drop = () => {
    if (isPaused) {
      return
    }
    // increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1)
      // also increase speed
      setDropTime(1000 / (level + 1) + 200)
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false })
    } else {
      // game over
      if (player.pos.y < 1) {
        setGameOver(true)
        handleAudio()
        setOn(false)
        setDropTime(null)
      }
      updatePlayerPos({ x: 0, y: 0, collided: true })
    }
  }

  const keyUp = ({ keyCode }) => {
    if (isPaused) {
      return
    }
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1000 / (level + 1) + 200)
      }
    }
  }

  const dropPlayer = () => {
    setDropTime(null)
    drop()
  }

  const move = ({ keyCode }) => {
    if (isPaused) {
      return
    }
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1)
      } else if (keyCode === 39) {
        movePlayer(1)
      } else if (keyCode === 40) {
        dropPlayer()
      } else if (keyCode === 38) {
        playerRotate(stage, 1)
      }
    }
  }

  useInterval(() => {
    drop()
  }, dropTime)

  return (
    <StyledTetrisWrapper
      role='button'
      tabIndex='0'
      onKeyDown={move}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text='Game Over' />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton
            callback={startGame}
            text={isOn ? 'Reset Game' : 'Start Game'}
          />
          <StartButton
            callback={handlePause}
            text={isPaused ? 'Unpause Game' : 'Pause Game'}
          />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  )
}

const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: url(${bgImage}) #000;
  background-size: cover;
  overflow: hidden;
`

const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;

  aside {
    width: 100%;
    max-width: 200px;
    display: block;
    padding: 0 20px;
  }
`
