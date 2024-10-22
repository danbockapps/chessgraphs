'use client'

import Link from 'next/link'
import {FC, useCallback, useEffect, useState} from 'react'
import Button from './button'
import Graph, {Datapoint} from './graph'
import {Spinner} from './spinner'
import Switch from './switch'
import useChesscomGames from './useChesscomGames'
import useColors from './useColors'
import useStream from './useStream'

export type SearchParams = {lichess: string; chesscom: string; years: string}

const Main: FC<SearchParams> = (searchParams) => {
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const [graphY, setGraphY] = useState<'time' | 'numGames'>('time')
  const [lichessLoading, setLichessLoading] = useState(false)
  const [chesscomLoading, setChesscomLoading] = useState(false)
  const {getColor, shuffleColors} = useColors()

  const onReceive = useCallback(
    (newItems: Datapoint[]) => setDatapoints((d) => [...d, ...newItems]),
    [],
  )

  const {read} = useStream({
    onMessage: onReceive,
    throttleMs: 1000,
    username: searchParams.lichess,
    years: Number(searchParams.years),
    setLoading: setLichessLoading,
  })

  const {loadGames} = useChesscomGames({
    username: searchParams.chesscom,
    years: Number(searchParams.years),
    onReceive,
    setLoading: setChesscomLoading,
  })

  const datapointsExist = datapoints.length > 0

  useEffect(() => {
    if (searchParams.lichess && !datapointsExist) read()
  }, [read, datapointsExist, searchParams.lichess])

  useEffect(() => {
    if (searchParams.chesscom) loadGames()
  }, [searchParams.chesscom, searchParams.years, loadGames])

  return (
    <>
      <div className="grid m-4 gap-4 md:flex md:items-center md:m-6">
        <Link href="/" className="col-span-1 text-xl md:flex-1">
          🔙
        </Link>

        <div className="flex gap-1 items-center md:whitespace-nowrap md:flex-1">
          Loaded games: {datapoints.length}
          {lichessLoading || chesscomLoading ? <Spinner className="text-black" /> : null}
        </div>

        <div className="justify-self-end md:flex-1">
          <Button onClick={shuffleColors}>Shuffle colors</Button>
        </div>

        <div className="col-span-3 justify-self-center flex gap-3">
          Hours spent
          <Switch
            isOn={graphY === 'numGames'}
            handleToggle={() => setGraphY(graphY === 'numGames' ? 'time' : 'numGames')}
          />
          Number of games
        </div>
      </div>

      {datapoints.length ? <Graph {...{datapoints, getColor, graphY}} /> : null}
    </>
  )
}

export default Main
