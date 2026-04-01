import Button from './components/ButtonComponents'
import Toggle from './components/ToggleButton'
import TextMirror from './components/TextMirror'
import OnMouseHover from './components/OnMouseHover'
import TrafficLight from './components/TrafficLight'
import TodoList from './components/Todo'

function App() {


  return (
    <>
      <p><b> <h1>Day2 </h1></b></p>
      <Button label="Submit" color="blue" />
      <Button label="Delete" color="red" />
      <Button label="Success" color="green" />
      <h2><b>Toggle Button</b></h2>
      <Toggle />
      <h2><b>Text Mirror</b></h2>
      <TextMirror />
      <h2><b>On Mouse Hover</b></h2>
      <OnMouseHover />
      
      <h2><b>Traffic Light</b></h2>
      <TrafficLight color="red" />
      <TrafficLight color="yellow" />
      <TrafficLight color="green" />
      <TodoList />
    </>
  )
}

export default App