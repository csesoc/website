import logo from './logo.svg';
import './App.css';
import Button from './components/button'
import Iframe from './components/iframe'

function App(data) {
  const { name, src } = data;
  return (
    <div className="App">
      <Button name={name}/>
      <Iframe src={src}/>
    </div>
  );
}

export default App;
