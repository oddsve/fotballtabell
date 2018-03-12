import React, { Component } from 'react';
import Turnering from './Turnering';
import Turneringsoppslag from './Turneringsoppslag';
import Fiksinput from './Fiksinput';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.handleEndretTurnering = this.handleEndretTurnering.bind(this);

        this.state = {
            turneringId: null,
            turneringsdata: {   turnering: "",
                                lagsliste: [],
                                kampliste: []}
        }
    }

    componentDidMount () {
      const persistState = localStorage.getItem('rootState');
      console.log("get state", persistState);
      if (persistState) {
        try {
          this.setState(JSON.parse(persistState));
        } catch (e) {
          // is not json
        }
      }
    }

    componentWillUnmount () {
      console.log("unmont");
    }


    hentTurnering = async () => {
        const response = await fetch('/api/turneringer/'+ this.state.turneringId );
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleEndretTurnering(turneringId){
        this.setState({turneringId : turneringId}, () =>
        this.hentTurnering()
            .then( res => {
                this.setState({turneringsdata : res}) ;
                localStorage.setItem('rootState', JSON.stringify(this.state));
            })
            .catch(err => console.log(err))
        )
    }

    render() {
        return (
            <div className="app">
                <h1>Tabeller for alle</h1>
                <div className="turnering">
                    <Turnering value={this.state.turneringsdata} />
                </div>
                <div className="turneringsvelger">
                    <h2>Velg turnering</h2>
                    <div className="fiksinput">
                        <Fiksinput onChange={this.handleEndretTurnering} />
                    </div>
                    <div className="oppslag">
                        <Turneringsoppslag  onChange={this.handleEndretTurnering} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
