import { Component } from 'react';
import IPerson from '../types/IPerson';

interface MainProps {
  items: IPerson[];
  searched: string;
  status: 'ok' | 'pending' | 'error';
  statusCode: number;
}

export default class Main extends Component<MainProps> {
  render() {
    return (
      <main className="main">
        <h3>Searched: {this.props.searched}</h3>
        <div className="card-container">
          {this.props.status === 'pending' && (
            <span aria-label="loading">Loading...</span>
          )}
          {this.props.status === 'error' &&
            `There is an error! ${this?.props?.statusCode}`}
          {this.props.status === 'ok' && (
            <>
              {this?.props.items?.length
                ? this.props?.items?.map((item) => (
                    <div
                      key={item.created}
                      className="card"
                      data-testid="person-card"
                    >
                      <h4 className="person-name">
                        {item.name ?? 'not defined'}
                      </h4>
                      <p>
                        Height: <b>{item.height ?? 'not defined'}</b>
                      </p>
                    </div>
                  ))
                : 'The list is empty'}
            </>
          )}
        </div>
      </main>
    );
  }
}
