import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chessgraphs',
  description: 'Graph your chess games',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
