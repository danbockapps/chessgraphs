'use client'

import {FC, useState} from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Button from './button'
import getDataArray from './getDataArray'
import useColors from './useColors'
import useStream from './useStream'

export type Datapoint = {
  id: string
  clock: {initial: number; increment: number}
  lastMoveAt: number
  // There are more fields but I'm only interested in these
}

const Graph: FC = () => {
  const [username, setUsername] = useState('')
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const {getColor, clearColors} = useColors()
  const dataArray = getDataArray(datapoints)

  const {read} = useStream({
    onMessage: (newItems) => setDatapoints((d) => [...d, ...newItems]),
    throttleMs: 1000,
    username,
  })

  const categories = dataArray.reduce((acc, cur) => {
    const keys = Object.keys(cur).filter((key) => key !== 'month' && !acc.includes(key))
    return [...acc, ...keys]
  }, [] as string[])

  return (
    <div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button
        onClick={() => {
          setDatapoints([])
          clearColors()
          read()
        }}
      >
        Search
      </Button>

      {dataArray.length > 0 ? (
        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={dataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {categories.map((category) => (
              <Line key={category} type="monotone" dataKey={category} stroke={getColor(category)} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div> No data to display</div>
      )}
    </div>
  )
}

export default Graph
