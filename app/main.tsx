'use client'

import Link from 'next/link'
import {FC, useEffect, useState} from 'react'
import Graph, {Datapoint} from './graph'
import Switch from './switch'
import useColors from './useColors'
import useStream from './useStream'

export type UsernameProps = {lichess: string; chesscom: string}

const Main: FC<UsernameProps> = (usernames) => {
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const [graphY, setGraphY] = useState<'time' | 'numGames'>('time')

  const {getColor} = useColors()

  const {read} = useStream({
    onMessage: (newItems) => setDatapoints((d) => [...d, ...newItems]),
    throttleMs: 1000,
    username: usernames.lichess,
  })

  useEffect(() => {
    read()
  }, [read])

  return (
    <div>
      <Link href="/">Back</Link>
      Hours spent
      <Switch
        isOn={graphY === 'numGames'}
        handleToggle={() => setGraphY(graphY === 'numGames' ? 'time' : 'numGames')}
      />
      Number of games
      <Graph {...{datapoints, getColor, graphY}} />
    </div>
  )
}

export default Main
