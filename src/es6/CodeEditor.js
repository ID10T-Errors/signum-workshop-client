import React from 'react';
import Codemirror from 'react-codemirror';

import 'codemirror/mode/javascript/javascript';

export default class CodeEditor extends React.Component {
  constructor() {
    super();

    this.state = {
      code: 'console.log(\'Hello, world!\');',
    };

    this.updateCode = this.updateCode.bind(this);
  }

  updateCode(code) {
    this.setState({
      code,
    });
  }

  render() {
    return (<Codemirror
      value={this.state.code}
      onChange={this.updateCode}
      options={{
        mode: 'javascript',
        lineNumbers: true,
      }}
    />);
  }
}
