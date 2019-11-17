import Header from './Header'

const layoutStyle = {
  maxWidth:'1200px',
  margin: 'auto',
  padding: 20,
}

export default function Layout(props) {
  return (
    <div style={layoutStyle}>
      <Header />
      {props.children}
    </div>
  )
}
