import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './App';
import Navbar from './Navbar';
import rootReducer from './reducers';

import skeleton from 'skeleton.css';
// import defaultcss from 'defaultcss';
// defaultcss('skeleton', skeleton);

import fontawesome from 'font-awesome/css/font-awesome.css';
import css from './styles/index.scss';

let additionalMiddleware;

if(process.env.NODE_ENV !== 'development') {
  additionalMiddleware = compose(applyMiddleware(thunk));
} else {
  additionalMiddleware = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}

const store = createStore(
  rootReducer,
  additionalMiddleware
);

render(
  <Provider store={store}>
    <BrowserRouter basename="/v2" >
      <div>
        <Navbar />
        <Route path="/" component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('main')
);
