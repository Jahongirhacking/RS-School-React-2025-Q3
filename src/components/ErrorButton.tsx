import { Component } from 'react';

type Props = {
  makeError: () => void;
};

export default class ErrorButton extends Component<Props> {
  render() {
    return <button onClick={this.props.makeError}>Error!</button>;
  }
}
