'use client'

import {FC, useState} from 'react'
import Button from './button'
import Graph, {Datapoint} from './graph'
import Switch from './switch'
import useColors from './useColors'
import useStream from './useStream'
import Entry from './entry'

const Main: FC = () => {
  const [mode, setMode] = useState<'entry' | 'graph'>('entry')
  const [lichessUsername, setLichessUsername] = useState('')
  const [chesscomUsername, setChesscomUsername] = useState('')
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const [graphY, setGraphY] = useState<'time' | 'numGames'>('time')

  const {getColor, clearColors} = useColors()

  const {read} = useStream({
    onMessage: (newItems) => setDatapoints((d) => [...d, ...newItems]),
    throttleMs: 1000,
    username: lichessUsername,
  })

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center mb-6">Chess Graphs</h1>

      {mode === 'entry' ? (
        <Entry
          {...{lichessUsername, setLichessUsername, chesscomUsername, setChesscomUsername}}
          onSubmit={() => {
            setMode('graph')
            setDatapoints([])
            clearColors()
            read()
          }}
        />
      ) : (
        <>
          <Button onClick={() => setMode('entry')}>Back</Button>
          Hours spent
          <Switch
            isOn={graphY === 'numGames'}
            handleToggle={() => setGraphY(graphY === 'numGames' ? 'time' : 'numGames')}
          />
          Number of games
          <Graph {...{datapoints, getColor, graphY}} />
        </>
      )}
    </div>
  )
}

export default Main
