import {FC} from 'react'
import Entry from './entry'
import Main, {UsernameProps} from './main'

type Props = {searchParams: UsernameProps}

const Home: FC<Props> = (props) => {
  const {lichess, chesscom} = props.searchParams
  return lichess || chesscom ? <Main {...{lichess, chesscom}} /> : <Entry />
}

export default Home
