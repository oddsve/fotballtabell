import React, { Component } from 'react';
import './Turnering.css';

class Lag extends Component {
    render() {
        return (
            <tr  className="lag">
                <td className="tall">{this.props.ranking}</td>
                <td className="tekst">{this.props.value.navn}</td>
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


class Turneringsinfo extends Component {
    render() {
        return (
            <div className="info">
                <h2>{this.props.value}</h2>
            </div>
        );
    }
}

class Tabell extends Component {
    render() {
        let alleLag = [];
        let i = 1;
        this.props.value.forEach(laget =>{
            alleLag.push(<Lag key={laget.lagTrimmet} ranking={i} value={laget}/>);
            i++;
        })
        return (alleLag);
    }
}

class Kamp extends Component {
    render() {
        return (
            <tr  className="lag">
                <td>{this.props.value.runde}</td>
                <td className="lav-pri">{this.props.value.dato}</td>
                <td>{this.props.value.hjemmelag}</td>
                <td>{this.props.value.bortelag}</td>
                <td>{this.props.value.resultat}</td>
            </tr>
        );
    }
}


class Kamper extends Component {
    render() {
        let kamper = [];
        let i = 0;
        this.props.value.forEach(kamp =>{
            kamper.push(<Kamp key={i} value={kamp}/>)
            i++;
        })
        return (kamper);
    }
}


class Turneringsdata extends Component {

    render() {
        let data = this.props.value;
        return (
            <div>
                <Turneringsinfo value={data.turnering} />
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
                    <Tabell value={data.lagsliste}/>
                    </tbody>
                </table>
                <table>
                    <tbody >
                    <Kamper value={data.kampliste}/>
                    </tbody>
                </table>
            </div>
        );
    }
}

class Turnering extends Component {
  render() {
      let data = this.props.value;
      console.log(data);
      if (data.lagsliste.length > 0 ){
        return (
          <Turneringsdata value={data} />
        );
      } else {
        return (
          <div> Henter data ... </div>
        )
      }
    }
}

export default Turnering;
