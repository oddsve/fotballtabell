import React, { Component } from 'react';
import Turnering from './Turnering';
import Turneringsoppslag from './Turneringsoppslag';
import Fiksinput from './Fiksinput';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.handleEndretTurnering = this.handleEndretTurnering.bind(this);
        this.turneringValgt = false;
        this.state = {
            turneringId: null,
            turneringsdata: {   turnering: "",
                                lagsliste: [],
                                kampliste: []}
        }
    }

    componentDidMount () {
      const persistState = localStorage.getItem('rootState');
      if (persistState) {
        this.turneringValgt = true;
        try {
          this.setState(
            { "turneringId" : JSON.parse(persistState).turneringId },
              () => this.hentTurnering()
            );
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
        this.setState({turneringsdata: body})
        localStorage.setItem('rootState', JSON.stringify(this.state));
    };

    handleEndretTurnering(turneringId){
      this.turneringValgt = true;
      this.setState({turneringsdata: {}}, () =>
        this.setState({turneringId : turneringId}, () =>
          this.hentTurnering()
            .catch(err => console.log(err))
        )
      )
    }

    render() {
        return (
            <div className="app">
                <h1>Tabeller for alle</h1>
                <div className="turnering">
                    <Turnering turneringvalgt={this.turneringValgt} value={this.state.turneringsdata} />
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
