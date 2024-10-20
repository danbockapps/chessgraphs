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

  const categories = Object.values(dataObj).reduce((acc, cur) => {
    const keys = Object.keys(cur).filter((key) => !acc.includes(key))
    return [...acc, ...keys]
  }, [] as string[])

  const allMonths = getAllMonths(dataObj)

  return {
    categories,
    dataArray: allMonths
      .map((month) => ({
        month,
        ...categories
          .map((c) => ({[c]: (dataObj[month] ?? {})[c] ?? 0}))
          .reduce((acc, cur) => ({...acc, ...cur}), {}),
      }))
      .sort((a, b) => (a.month < b.month ? -1 : 1)),
  }
}

const getReadableTimeControl = (clock: {initial: number; increment: number}) => {
  const minutes = Math.floor((clock.initial || 0) / 60)
  return `${minutes} + ${clock.increment}`
}

const getAllMonths = (dataObj: Record<string, Record<string, number>>) => {
  const months = Object.keys(dataObj).sort()
  if (months.length === 0) return []

  const [startYear, startMonth] = months[0].split('/').map(Number)
  const [endYear, endMonth] = months[months.length - 1].split('/').map(Number)

  const allMonths = []
  for (let year = startYear; year <= endYear; year++) {
    const start = year === startYear ? startMonth : 1
    const end = year === endYear ? endMonth : 12
    for (let month = start; month <= end; month++) {
      allMonths.push(`${year}/${month < 10 ? '0' : ''}${month}`)
    }
  }

  return allMonths
}

export default getDataArray
