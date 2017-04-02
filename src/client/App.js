import React from 'react';

class App extends React.Component {

  render() {
    const stuff = sessionStorage.getItem('payload');
    return (
      <div>{JSON.parse(stuff)}</div>
    );
  }
}

export default App;
