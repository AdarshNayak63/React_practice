import Header from './components/Header'
import SampleComponent from './components/SampleComponent'

function App() {

  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header />
      <h1>Hello World</h1>
      <SampleComponent />
      <p>This is the currentYear : {currentYear}</p>
    </>
  )
}

export default App