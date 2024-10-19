'use client'

import {FC, useState} from 'react'
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts'
import Button from './button'

type Datapoint = {
  id: string
  clock: {initial: number; increment: number}
  lastMoveAt: number
  // There are more fields but I'm only interested in these
}

const Graph: FC = () => {
  const [username, setUsername] = useState('')
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])

  const data = datapoints.reduce(
    (acc, cur) => {
      const date = new Date(cur.lastMoveAt)
      const month = date.getMonth()
      const year = date.getFullYear()
      const bucket = `${year}/${month + 1}`
      const category = getReadableTimeControl(cur.clock)

      return {
        ...acc,
        [bucket]: {...(acc[bucket] ?? {}), [category]: (acc[bucket]?.[category] ?? 0) + 1},
      }
    },
    {} as Record<string, Record<string, number>>,
  )

  console.log(data)

  const onClick = async () => {
    const onMessage = (obj: Datapoint) => setDatapoints((d) => [...d, obj])
    const onComplete = () => console.log('The stream has completed')

    const start = new Date()
    start.setDate(start.getDate() - 30) // It handles month transitions automatically
    start.setDate(1) // Set it to the beginning of the month

    const response = await fetch(
      `https://lichess.org/api/games/user/danbock?${new URLSearchParams({
        since: `${start?.getTime() ?? ''}`,
        moves: 'false',
      })}`,
      {headers: {Accept: 'application/x-ndjson'}},
    )

    if (response.body) {
      const stream = response.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const {done, value} = await stream.read()

        if (done) {
          if (buf.length > 0) onMessage(JSON.parse(buf))
          break
        } else {
          buf += decoder.decode(value, {stream: true})
          const parts = buf.split(/\r?\n/)
          buf = parts.pop() ?? '' // parts.pop() seems to always return '' but I guess it could have a partial object

          for (const i of parts.filter((p) => p)) onMessage(JSON.parse(i))
        }
      }

      onComplete()
    }
  }

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button {...{onClick}}>Search</Button>
      <LineChart
        width={500}
        height={300}
        data={Object.entries(data).map(([name, obj]) => ({name, ...obj}))}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="5 + 3" />
        <Line type="monotone" dataKey="30 + 20" />
      </LineChart>
    </div>
  )
}

const getReadableTimeControl = (clock: {initial: number; increment: number}) => {
  const minutes = Math.floor(clock.initial / 60)
  return `${minutes} + ${clock.increment}`
}

export default Graph
