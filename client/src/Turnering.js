import React, { Component } from 'react';
import './Turnering.css';

class Lag extends Component {
    constructor(props) {
        super(props);
        this.handleNavnClick = this.handleNavnClick.bind(this);
    }

    handleNavnClick(e) {
        this.props.onNavnClick(e);
    }

    render() {
        return (
            <tr  className="lag">
                <td className="tall">{this.props.ranking}</td>
                <td className="tekst klikkbar" onClick={this.handleNavnClick}>{this.props.value.navn}</td>
                <td className="tall">{this.props.value.kamper}</td>
                <td className="tall">{this.props.value.vunnet}</td>
                <td className="tall">{this.props.value.uavgjort}</td>
                <td className="tall">{this.props.value.tapt}</td>
                <td className="bredtall">{this.props.value.pm + " - " + this.props.value.mm}</td>
                <td className="tall">{this.props.value.poeng}</td>
            </tr>
        );
    }
}


class Tabell extends Component {
    constructor(props) {
        super(props);

        this.handleNavnClick = this.handleNavnClick.bind(this);
    }

    handleNavnClick(e) {
        this.props.onNavnClick(e);
    }

    render() {
        let alleLag = [];
        let i = 1;
        this.props.value.forEach(laget =>{
            alleLag.push(<Lag key={laget.lagTrimmet} ranking={i} onNavnClick={this.handleNavnClick} value={laget}/>);
            i++;
        })
        return (alleLag);
    }
}

class Kamp extends Component {
    render() {
      let kampData = this.props.value;
        return (
            <tr  className="lag">
                <td>{kampData.runde}</td>
                <td className="lav-pri">{kampData.dato}</td>
                <td className={kampData.hjemmeseier}>{kampData.hjemmelag}</td>
                <td className={kampData.borteseier}>{kampData.bortelag}</td>
                <td>{kampData.resultat}</td>
            </tr>
        );
    }
}


class Kamper extends Component {
    render() {
        let kamper = [];
        let i = 0;
        this.props.value.forEach(kamp =>{
            if (!this.props.visBare){
              kamper.push(<Kamp key={i} value={kamp}/>)
              i++;
            } else {
              if (kamp.hjemmelag.replace(/ /g,'') === this.props.visBare.replace(/ /g,'')
                  || kamp.bortelag.replace(/ /g,'') === this.props.visBare.replace(/ /g,'') ){
                kamper.push(<Kamp key={i} value={kamp}/>)
                i++;
              }
            }
        })
        return (kamper);
    }
}


class Turneringsdata extends Component {
    constructor(props) {
        super(props);
        this.state = {
           visBare : null,
           erFavoritt: this.props.erFavoritt
         }
        this.handleNavnClick = this.handleNavnClick.bind(this);
        this.handleVisAlleClick = this.handleVisAlleClick.bind(this);
        this.handleFavorittTogle = this.handleFavorittTogle.bind(this);
    }

    handleNavnClick(e) {
      this.setState({visBare: e.target.innerText});
    }
    handleVisAlleClick() {
      this.setState({visBare: null});
    }

    handleFavorittTogle() {
      this.setState({erFavoritt: !this.state.erFavoritt});
      this.props.onFavorittEndret(this.props.value.turnering, this.props.turneringId);
    }


    render() {
        let data = this.props.value;
        let visAlle = "";
        if (this.state.visBare) {
          visAlle = "Vis alle";
        }
        return (
            <div>
              <div className="info">
                <h2>
                  {data.turnering}
                  <button
                    className={["favoritt", "favoritt-"+this.state.erFavoritt].join(' ')}
                    onClick={this.handleFavorittTogle}>Favoritt</button>
                </h2>
              </div>
              <table className="tabell">
                  <thead>
                      <tr  className="lag">
                          <th className="tall">#</th>
                          <th className="tekst">Lag</th>
                          <th className="tall">K</th>
                          <th className="tall">V</th>
                          <th className="tall">U</th>
                          <th className="tall">T</th>
                          <th className="bredtall">MF</th>
                          <th className="tall">Poeng</th>
                      </tr>
                  </thead>
                  <tbody >
                  <Tabell onNavnClick={this.handleNavnClick} value={data.lagsliste}/>
                  </tbody>
              </table>
              <div className="klikkbar" onClick={this.handleVisAlleClick}>{visAlle}</div>
              <table>
                  <tbody >
                  <Kamper visBare={this.state.visBare} value={data.kampliste}/>
                  </tbody>
              </table>
          </div>
        );
    }
}

class Turnering extends Component {
  constructor(props) {
      super(props);
      this.handleFavorttEndret = this.handleFavorttEndret.bind(this);
  }

  handleFavorttEndret(turnering, turneringId){
    this.props.onFavorittEndret(turnering, turneringId);
  }

  render() {
      let data = this.props.value;
      let turneringValgt = this.props.turneringvalgt;
      if (data.lagsliste && data.lagsliste.length > 0){
        return (
          <Turneringsdata
            onFavorittEndret={this.handleFavorttEndret}
            turneringId={this.props.turneringId}
            erFavoritt={this.props.erFavoritt}
            value={data} />
        );
      } else  if (turneringValgt){
        return (
          <div> Henter data ... </div>
        )
      } else {
        return (
          <div> Velg turnering </div>
        )
      }
    }
}

export default Turnering;
