import './App.css';
import { Switch, Route } from "react-router-dom";
import Recipe from './Recipe';
import Home from './Home';
import Header from './Header';

function App() {
  return (

    <div className="App">
      <Header />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/recipe/:id">
          <Recipe />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
