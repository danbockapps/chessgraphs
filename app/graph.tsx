'use client'

import {FC, useState} from 'react'
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
  console.log(datapoints)

  const onClick = async () => {
    const onMessage = (obj: Datapoint) => setDatapoints((d) => [...d, obj])
    const onComplete = () => console.log('The stream has completed')

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 2)

    const response = await fetch(
      `https://lichess.org/api/games/user/danbock?${new URLSearchParams({
        since: `${oneWeekAgo?.getTime() ?? ''}`,
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
      Graph
    </div>
  )
}

export default Graph
