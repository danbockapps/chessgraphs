'use client'

import {FC} from 'react'
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
import getDataArray from './getDataArray'

interface Props {
  datapoints: Datapoint[]
  getColor: (key: string) => string
  graphY: 'time' | 'numGames'
}

export type Datapoint = {
  id: string
  clock: {initial: number; increment?: number}
  createdAt: number
  lastMoveAt: number
  // There are more fields but I'm only interested in these
}

const Graph: FC<Props> = (props) => {
  const {categories, dataArray} = getDataArray(props.datapoints, props.graphY)

  return (
    <div className="h-[75vh] w-full">
      {dataArray.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {categories.map((category) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={props.getColor(category)}
              />
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
