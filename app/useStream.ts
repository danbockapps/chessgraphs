import {LICHESS_TOKEN} from '@/env'
import {Datapoint} from './graph'
import {useCallback, useRef} from 'react'

interface Props {
  onMessage: (newItems: Datapoint[]) => void
  throttleMs: number
  username: string
}

const useStream = ({onMessage, throttleMs, username}: Props) => {
  const queue = useRef<Datapoint[]>([])

  const read = useCallback(async () => {
    console.time('Stream duration')
    queue.current = []

    const intervalId = setInterval(() => {
      if (queue.current.length > 0) {
        onMessage(queue.current)
        queue.current = []
      } else clearInterval(intervalId)
    }, throttleMs)

    const start = new Date()
    start.setDate(start.getDate() - 3 * 30) // It handles month transitions automatically
    start.setDate(1) // Set it to the beginning of the month

    const response = await fetch(
      `https://lichess.org/api/games/user/${username}?${new URLSearchParams({
        since: `${start?.getTime() ?? ''}`,
        moves: 'false',
      })}`,
      {
        headers: {
          Accept: 'application/x-ndjson',
          // Authorization: 'Bearer ' + LICHESS_TOKEN,
        },
      },
    )

    if (response.body) {
      const stream = response.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const {done, value} = await stream.read()

        if (done) {
          if (buf.length > 0) queue.current.push(JSON.parse(buf))
          break
        } else {
          buf += decoder.decode(value, {stream: true})
          const parts = buf.split(/\r?\n/)
          buf = parts.pop() ?? '' // parts.pop() seems to always return '' but I guess it could have a partial object

          for (const i of parts.filter((p) => p)) queue.current.push(JSON.parse(i))
        }
      }

      onComplete()
      console.timeEnd('Stream duration')
    }
  }, [])

  return {read}
}

const onComplete = () => console.log('The stream has completed')

export default useStream
