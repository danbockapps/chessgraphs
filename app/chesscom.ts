import {Datapoint} from './graph'

type Props = {
  username: string
  years: number
  onReceive: (datapoints: Datapoint[]) => void
  setLoading: (loading: boolean) => void
}

const useChesscomGames = ({username, years, onReceive, setLoading}: Props) => {
  const loadGames = async () => {
    setLoading(true)
    console.time('Chess.com duration')
    const res = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`)
    const data = (await res.json()) as {archives: string[]}
    console.timeEnd('Chess.com duration')

    const currentMonth = new Date().getMonth() + 1
    const startYear = new Date().getFullYear() - years

    const archives = data.archives.filter((archive) => {
      const yyyymm = archive.slice(-7)
      const mm = Number(yyyymm.slice(5))
      const yyyy = Number(yyyymm.slice(0, 4))
      return yyyy > startYear || (yyyy === startYear && mm >= currentMonth)
    })

    const promises = archives.map(async (archive) => {
      const res = await fetch(archive)
      const data = (await res.json()) as {games: Game[]}
      onReceive(
        data.games
          .filter((g) => g.time_class !== 'daily')
          .map((g) => {
            const [initial, increment] = g.time_control.split('+').map(Number)
            const estGameLength = (initial + 40 * (increment ?? 0)) * 2 * 0.65
            const createdAt = (g.end_time - estGameLength) * 1000

            return {
              id: g.uuid,
              clock: {initial, increment},
              createdAt,
              lastMoveAt: g.end_time * 1000,
            }
          }),
      )
    })

    await Promise.all(promises)
    setLoading(false)
  }

  return {loadGames}
}

interface Player {
  rating: number
  result: ChesscomResult
  '@id': string
  username: string
  uuid: string
}

export type ChesscomResult =
  | 'repetition'
  | 'abandoned'
  | 'checkmated'
  | 'stalemate'
  | 'insufficient'
  | 'agreed'
  | 'timeout'
  | 'timevsinsufficient'
  | 'win'
  | 'resigned'

export interface Game {
  url: string
  pgn: string
  time_control: string
  end_time: number
  rated: boolean
  tcn: string
  uuid: string
  initial_setup: string
  fen: string
  time_class: string
  rules: string
  white: Player
  black: Player
  eco: string
}

export default useChesscomGames
