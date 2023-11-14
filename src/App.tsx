import { Webcam } from './components/Video'
import { Title } from './components/Title'
import { Output } from './components/Output'

export function App() {
  return (
    <div className="container">
      <Title />

      <Webcam />

      <Output />
    </div>
  )
}
