'use client'

import Link from 'next/link'
import {FC, useEffect, useState} from 'react'
import Button from './button'
import Graph, {Datapoint} from './graph'
import Switch from './switch'
import useColors from './useColors'
import useStream from './useStream'

export type UsernameProps = {lichess: string; chesscom: string}

const Main: FC<UsernameProps> = (usernames) => {
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const [graphY, setGraphY] = useState<'time' | 'numGames'>('time')
  const {getColor, shuffleColors} = useColors()

  const {read} = useStream({
    onMessage: (newItems) => setDatapoints((d) => [...d, ...newItems]),
    throttleMs: 1000,
    username: usernames.lichess,
  })

  const datapointsExist = datapoints.length > 0

  useEffect(() => {
    if (!datapointsExist) read()
  }, [read, datapointsExist])

  return (
    <>
      <div className="flex gap-3 m-4 md:m-6">
        <Link href="/" className="text-xl flex-1">
          🔙
        </Link>
        <div className="flex-1">
          <Button onClick={shuffleColors}>Shuffle colors</Button>
        </div>
        Hours spent
        <Switch
          isOn={graphY === 'numGames'}
          handleToggle={() => setGraphY(graphY === 'numGames' ? 'time' : 'numGames')}
        />
        Number of games
      </div>
      <Graph {...{datapoints, getColor, graphY}} />
    </>
  )
}

export default Main
