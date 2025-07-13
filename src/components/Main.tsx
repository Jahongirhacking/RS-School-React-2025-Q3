import { Component } from "react";
import IPerson from "../types/IPerson";

interface MainProps {
  items: IPerson[];
  searched: string;
  status: "ok" | "pending" | "error";
}

export default class Main extends Component<MainProps> {
  render() {
    return (
      <main className="main">
        <h3>Searched: {this.props.searched}</h3>
        <div className="card-container">
          {this.props.status === "pending" && "Loading..."}
          {this.props.status === "error" && "There is an error!"}
          {this.props.status === "ok" && (
            <>
              {this?.props.items?.length
                ? this.props?.items?.map((item) => (
                    <div key={item.created} className="card">
                      <h4 className="person-name">{item.name}</h4>
                      <p>
                        Height: <b>{item.height}</b>
                      </p>
                    </div>
                  ))
                : "The list is empty"}
            </>
          )}
        </div>
      </main>
    );
  }
}
