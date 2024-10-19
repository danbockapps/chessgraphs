'use client'

import {FC, useState} from 'react'
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts'
import Button from './button'
import readStream from './readStream'

export type Datapoint = {
  id: string
  clock: {initial: number; increment: number}
  lastMoveAt: number
  // There are more fields but I'm only interested in these
}

const Graph: FC = () => {
  const [username, setUsername] = useState('')
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])

  const dataObj = datapoints.reduce(
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

  const dataArray = Object.entries(dataObj).map(([month, obj]) => ({month, ...obj}))

  const categories = dataArray.reduce((acc, cur) => {
    const keys = Object.keys(cur).filter((key) => key !== 'month' && !acc.includes(key))
    return [...acc, ...keys]
  }, [] as string[])

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button onClick={() => readStream((obj) => setDatapoints((d) => [...d, obj]))}>Search</Button>
      <LineChart
        width={900}
        height={600}
        data={dataArray}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {categories.map((category) => (
          <Line key={category} type="monotone" dataKey={category} />
        ))}
      </LineChart>
    </div>
  )
}

const getReadableTimeControl = (clock: {initial: number; increment: number}) => {
  const minutes = Math.floor(clock.initial / 60)
  return `${minutes} + ${clock.increment}`
}

export default Graph
