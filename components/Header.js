import Link from 'next/link'

const linkStyle = {
  lineHeight:'50px',
}

export default function Header() {
  return (
    <div>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
    </div>
  )
}
