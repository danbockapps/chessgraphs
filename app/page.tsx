import {FC} from 'react'
import Entry from './entry'
import Main, {SearchParams} from './main'

type Props = {searchParams: SearchParams}

const Home: FC<Props> = (props) => {
  const {lichess, chesscom, years} = props.searchParams
  return lichess || chesscom ? <Main {...{lichess, chesscom, years}} /> : <Entry />
}

export default Home
