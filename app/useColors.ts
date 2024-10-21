import {useState} from 'react'

type Color = {hue: number; saturation: number; lightness: number}
type Colors = {[key: string]: Color}

const useColors = () => {
  const [colors, setColors] = useState<Colors>({})

  const getColor = (key: string) => {
    if (colors[key]) return stringify(colors[key])
    else {
      const newColor = findDistinctColor(Object.values(colors))
      setColors((prevColors) => ({...prevColors, [key]: newColor}))
      return stringify(newColor)
    }
  }

  return {getColor}
}

const stringify = (color: Color) => `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`

function getColorDistance(hue1: number, hue2: number) {
  // Calculate the shortest distance between two hues on the color wheel
  const diff = Math.abs(hue1 - hue2)
  return Math.min(diff, 360 - diff)
}

function findDistinctColor(existingColors: Color[], saturation = 70, lightness = 50) {
  // Check if there are no existing colors
  if (existingColors.length === 0) {
    return {hue: 0, saturation, lightness} // Default color
  }

  let maxDistance = 0
  let bestHue = 0

  // Iterate through possible hues (0-360 degrees) in steps for efficiency
  const step = 5 // Smaller step for more precision, e.g., 5 degrees
  for (let hue = 0; hue < 360; hue += step) {
    // Find the minimum distance of the current hue to all existing colors
    const minDistance = existingColors.reduce((minDist, color) => {
      const distance = getColorDistance(hue, color.hue)
      return Math.min(minDist, distance)
    }, Infinity)

    // If the minimum distance for this hue is the largest found so far, update the best hue
    if (minDistance > maxDistance) {
      maxDistance = minDistance
      bestHue = hue
    }
  }

  // Return the hue with the maximum distance from existing colors, along with given saturation and lightness
  return {hue: bestHue, saturation, lightness}
}

export default useColors
