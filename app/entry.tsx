import {FC} from 'react'
import Button from './button'

interface Props {
  lichessUsername: string
  setLichessUsername: (username: string) => void
  chesscomUsername: string
  setChesscomUsername: (username: string) => void
  onSubmit: () => void
}

const Entry: FC<Props> = (props) => {
  return (
    <div className="w-11/12 md:w-1/2 lg:w-1/3 bg-slate-50 flex flex-col">
      <h2 className="text-center mt-6">Enter at least one</h2>
      <input
        type="text"
        placeholder="Lichess username"
        className="p-2 mx-6 mt-6 border border-gray-300 rounded"
        value={props.lichessUsername}
        onChange={(e) => props.setLichessUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Chess.com username"
        className="p-2 mx-6 mt-6 border border-gray-300 rounded"
        value={props.chesscomUsername}
        onChange={(e) => props.setChesscomUsername(e.target.value)}
      />

      <Button className="mx-6 my-6" variant="filled" onClick={props.onSubmit}>
        Search
      </Button>
    </div>
  )
}

export default Entry
