import React from 'react';
import SingleOriginTable from './SingleOriginTable';
import BlendTable from './BlendTable';

class App extends React.Component {

  render() {
    const bootstrappedData = JSON.parse(sessionStorage.getItem('payload'));
    const content = Object.keys(bootstrappedData);
    return (
      <div>
        <SingleOriginTable />
        <BlendTable />
      </div>
    );
  }
}

export default App;
