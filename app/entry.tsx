'use client'

import {FC, useState} from 'react'
import Button from './button'

const Entry: FC = () => {
  const [lichessUsername, setLichessUsername] = useState('')
  const [chesscomUsername, setChesscomUsername] = useState('')

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center mb-6">Chess Graphs</h1>

      <form method="GET" className="w-11/12 md:w-1/2 lg:w-1/3 bg-slate-50 flex flex-col" action="/">
        <h2 className="text-center mt-6">Enter at least one</h2>
        <input
          type="text"
          name="lichess"
          placeholder="Lichess username"
          className="p-2 mx-6 mt-6 border border-gray-300 rounded"
          value={lichessUsername}
          onChange={(e) => setLichessUsername(e.target.value)}
        />
        <input
          type="text"
          name="chesscom"
          placeholder="Chess.com username"
          className="p-2 mx-6 mt-6 border border-gray-300 rounded"
          value={chesscomUsername}
          onChange={(e) => setChesscomUsername(e.target.value)}
        />
        <p className="text-center mt-6">Amount of data to load:</p>
        <select
          name="years"
          defaultValue={2}
          className="p-3 mx-6 mt-6 border border-gray-300 rounded"
        >
          <option value={1}>1 year</option>
          <option value={2}>2 years</option>
          <option value={3}>3 years</option>
          <option value={4}>4 years</option>
          <option value={5}>5 years</option>
        </select>
        <Button
          className="mx-6 my-6"
          variant="filled"
          type="submit"
          disabled={!lichessUsername && !chesscomUsername}
        >
          Search
        </Button>
      </form>
    </div>
  )
}

export default Entry
