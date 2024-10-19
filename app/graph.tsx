'use client'

import {FC, useState} from 'react'
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts'
import Button from './button'
import generateColors from './generateColors'
import getDataArray from './getDataArray'
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
  const dataArray = getDataArray(datapoints)

  const categories = dataArray.reduce((acc, cur) => {
    const keys = Object.keys(cur).filter((key) => key !== 'month' && !acc.includes(key))
    return [...acc, ...keys]
  }, [] as string[])

  const colors = generateColors(categories.length)

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

        {categories.map((category, i) => (
          <Line key={category} type="monotone" dataKey={category} stroke={colors[i]} />
        ))}
      </LineChart>
    </div>
  )
}

export default Graph
