import React from 'react';

class App extends React.Component {

  render() {
    const bootstrappedData = JSON.parse(sessionStorage.getItem('payload'));
    const content = Object.keys(bootstrappedData);
    return (
      <div>{content}</div>
    );
  }
}

export default App;
