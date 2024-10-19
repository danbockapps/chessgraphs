import {Datapoint} from './graph'

const getDataArray = (datapoints: Datapoint[]) => {
  const dataObj = datapoints.reduce(
    (acc, cur) => {
      if (!cur.clock) return acc

      const date = new Date(cur.lastMoveAt)
      const month = date.getMonth()
      const year = date.getFullYear()
      const bucket = `${year}/${month < 9 ? '0' : ''}${month + 1}`
      const category = getReadableTimeControl(cur.clock)

      return {
        ...acc,
        [bucket]: {...(acc[bucket] ?? {}), [category]: (acc[bucket]?.[category] ?? 0) + 1},
      }
    },
    {} as Record<string, Record<string, number>>,
  )

  return Object.entries(dataObj)
    .map(([month, obj]) => ({month, ...obj}))
    .sort((a, b) => (a.month < b.month ? -1 : 1))
}

const getReadableTimeControl = (clock: {initial: number; increment: number}) => {
  if (!clock.initial) console.log('clock.initial is undefined', {clock})
  const minutes = Math.floor((clock.initial || 0) / 60)
  return `${minutes} + ${clock.increment}`
}

export default getDataArray
