import React, { Component } from 'react';
import Turnering from './Turnering';
import Turneringsoppslag from './Turneringsoppslag';
import Fiksinput from './Fiksinput';
import Favoritter from './Favoritter';

import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.handleEndretTurnering = this.handleEndretTurnering.bind(this);
        this.handleFavorttEndret = this.handleFavorttEndret.bind(this);
        this.turneringValgt = false;
        this.state = {
            turneringId: null,
            favoritter: {},
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

          this.setState(
            { "favoritter" : JSON.parse(persistState).favoritter }
          );

        } catch (e) {
          // is not json
        }
      }
    }

    erFavoritt(turneringId) {
      if (!this.state.favoritter) return false;
      if  (this.state.favoritter[turneringId]) return true;

      return false;
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

    handleFavorttEndret(turnering, turneringId){
      let fav = this.state.favoritter;
      if (!fav) fav = {};

      if (fav[turneringId]){
        delete(fav[turneringId]);
      }  else {
        fav[turneringId]=turnering;
      }

      this.setState({favoritter: fav});
      localStorage.setItem('rootState', JSON.stringify(this.state));

    }

    render() {
        return (
            <div className="app">
                <h1>Tabeller for alle</h1>
                <div className="turnering">
                    <Turnering  onFavorittEndret={this.handleFavorttEndret}
                                turneringvalgt={this.turneringValgt}
                                turneringId={this.state.turneringId}
                                erFavoritt={this.erFavoritt(this.state.turneringId)}
                                value={this.state.turneringsdata} />
                </div>
                <div className="turneringsvelger">
                    <h2>Velg turnering</h2>
                    <div className="favoritter">
                        <Favoritter onClick={this.handleEndretTurnering} value={this.state.favoritter} />
                    </div>
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
