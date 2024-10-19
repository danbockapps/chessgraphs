export default function generateColors(numColors: number) {
  const colors = []
  const saturation = 70 // percent (70 is a good balance for color vibrancy)
  const lightness = 50 // percent (50 keeps the colors balanced in brightness)

  for (let i = 0; i < numColors; i++) {
    const hue = (i * 360) / numColors // evenly distribute hues around the color wheel
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }

  return colors
}
