'use client'

import {FC, useState} from 'react'
import Button from './button'
import Graph, {Datapoint} from './graph'
import useColors from './useColors'
import useStream from './useStream'

const Main: FC = () => {
  const [username, setUsername] = useState('')
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])

  const {getColor, clearColors} = useColors()

  const {read} = useStream({
    onMessage: (newItems) => setDatapoints((d) => [...d, ...newItems]),
    throttleMs: 1000,
    username,
  })

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

      <Graph {...{datapoints, getColor}} />
    </div>
  )
}

export default Main
