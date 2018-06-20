import React, { Component } from 'react';


class Favoritter extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(e.target.value);
    }

    render() {
        let turneringer = [];
        let favoritter = this.props.value;
        for (let key in favoritter){
          if (!favoritter.hasOwnProperty(key)) continue;
            turneringer.push(<button key={key} onClick={this.handleClick} value={key}>{favoritter[key]}</button>)
        }

        if (turneringer.length === 0){
          return null;
        }
        else if (turneringer.length > 0 ){
          return (
              <div>
                  <h4>Favoritter</h4>
                  {turneringer}
              </div>
          );
        } else {
          return (
              <div> Henter data ... </div>
          );
        }
    }
}

export default Favoritter;
