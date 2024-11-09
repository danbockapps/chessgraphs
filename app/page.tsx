import {FC} from 'react'
import Entry from './entry'
import Main, {SearchParams} from './main'
import {headers} from 'next/headers'

type Props = {searchParams: SearchParams}

const Home: FC<Props> = async (props) => {
  const {lichess, chesscom, years} = props.searchParams

  if (lichess || chesscom) {
    logWithDate(`lichess: ${lichess} chesscom: ${chesscom} years: ${years}`)
    return <Main {...{lichess, chesscom, years}} />
  } else {
    logWithDate(`referer: ${headers().get('referer')}`)
    return <Entry />
  }
}

const logWithDate = (message: string) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  console.log(`${formattedDate} ${message}`)
}

export default Home
