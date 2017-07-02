import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import MainCalculator from './MainCalculator';
import ContainerPage from './ContainerPage';
import Navbar from './Navbar';
import rootReducer from './reducers';
import css from './styles/index.scss';

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);

render(
  <Provider store={store}>
    <BrowserRouter basename="/v2" >
      <div>
        <Navbar />
        <App>
          <Route exact path="/" component={MainCalculator} />
          <Route exact path="/containers" component={ContainerPage} />
        </App>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('main')
);
