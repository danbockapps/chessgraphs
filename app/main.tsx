'use client'

import Link from 'next/link'
import {FC, useEffect, useState} from 'react'
import Button from './button'
import useChesscomGames from './chesscom'
import Graph, {Datapoint} from './graph'
import Switch from './switch'
import useColors from './useColors'
import useStream from './useStream'

export type SearchParams = {lichess: string; chesscom: string; years: string}

const Main: FC<SearchParams> = (searchParams) => {
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const [graphY, setGraphY] = useState<'time' | 'numGames'>('time')
  const {getColor, shuffleColors} = useColors()

  const {read} = useStream({
    onMessage: (newItems) => setDatapoints((d) => [...d, ...newItems]),
    throttleMs: 1000,
    username: searchParams.lichess,
    years: Number(searchParams.years),
  })

  const {loadGames} = useChesscomGames({
    username: searchParams.chesscom,
    years: Number(searchParams.years),
    onReceive: (newItems) => setDatapoints((d) => [...d, ...newItems]),
  })

  const datapointsExist = datapoints.length > 0

  useEffect(() => {
    if (searchParams.lichess && !datapointsExist) read()
  }, [read, datapointsExist, searchParams.lichess])

  useEffect(() => {
    if (searchParams.chesscom) loadGames()
  }, [searchParams.chesscom, searchParams.years])

  return (
    <>
      <div className="grid grid-cols-2 m-4 gap-4 md:flex md:m-6">
        <Link href="/" className="col-span-1 text-xl md:flex-1">
          🔙
        </Link>

        <div className="col-span-1 justify-self-end md:flex-1">
          <Button onClick={shuffleColors}>Shuffle colors</Button>
        </div>

        <div className="col-span-2 justify-self-center flex gap-3">
          Hours spent
          <Switch
            isOn={graphY === 'numGames'}
            handleToggle={() => setGraphY(graphY === 'numGames' ? 'time' : 'numGames')}
          />
          Number of games
        </div>
      </div>

      <Graph {...{datapoints, getColor, graphY}} />
    </>
  )
}

export default Main
