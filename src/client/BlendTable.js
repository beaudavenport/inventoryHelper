import React from 'react';

class BlendTable extends React.Component {

  render() {
    const bootstrappedData = JSON.parse(sessionStorage.getItem('payload'));
    const content = Object.keys(bootstrappedData);
    return (
      <table>
        <thead>
          <tr>
            <td>Blend</td>
            <td>Weight</td>
          </tr>
        </thead>
      </table>
    );
  }
}

export default BlendTable;
