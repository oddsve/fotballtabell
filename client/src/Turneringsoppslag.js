import React, { Component } from 'react';
import './Turneringsoppslag.css'

class Sesongvelger extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onSesongChange(e.target.value);
    }

    render() {
        let sesonger = [];
        this.props.options.forEach(sesong =>{
            sesonger.push(<option key={sesong.id} value={sesong.id}>{sesong.navn}</option>)
        })
        return (
            <form>
                <select onChange={this.handleChange}>
                    {sesonger}
                </select>
            </form>
        );
    }
}

class Kretsvelger extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onKretsChange(e.target.value);
    }

    render() {
        let kretser = [];
        this.props.options.forEach(krets =>{
            kretser.push(<option key={krets.id} value={krets.id}>{krets.navn}</option>)
        })

        return (
            <form>
                <select value={this.props.value} onChange={this.handleChange}>
                    {kretser}
                </select>
            </form>
        );
    }
}

class Klubbvelger extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onKlubbChange(e.target.value);
    }

    render() {
        let klubber = [];
        klubber.push(<option key={0} ></option>)
        this.props.options.forEach(klubb =>{
            klubber.push(<option key={klubb.id} value={klubb.id}>{klubb.navn}</option>)
        })

        return (
            <form>
                <select  onChange={this.handleChange}>
                    {klubber}
                </select>
            </form>
        );
    }
}

class Turneringsknapper extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(e.target.value);
    }

    render() {
        let turneringer = [];
        this.props.value.forEach(turnering =>{
            turneringer.push(<button key={turnering.id} onClick={this.handleClick} value={turnering.id}>{turnering.navn}</button>)
        })


        return (

            <div>
                <h4>Turneringer</h4>
                {turneringer}
            </div>

        );
    }
}

class Turneringsoppslag extends Component {

    constructor(props) {
        super(props);
        this.handleValgtSesong = this.handleValgtSesong.bind(this);
        this.handleValgtKrets = this.handleValgtKrets.bind(this);
        this.handleValgtKlubb = this.handleValgtKlubb.bind(this);
        this.handleValgtTurnering = this.handleValgtTurnering.bind(this);

        this.state = {  sesonger: [] ,
            kretser: [],
            klubber: [],
            turneringer: [],
            valgtSesong: null,
            valgtKrets: 13,
            valgtKlubb: null,
            turnering: ''
        };
    }


    componentDidMount() {
        this.hentSesonger()
            .then( res => {
                this.setState({sesonger : res}) ;
                this.setState({valgtSesong : res[0].id}) ;
            })
            .catch(err => console.log(err));

        this.hentKretser()
            .then( res => {
                this.setState({kretser : res}) ;
            })
            .catch(err => console.log(err));


        this.hentKlubber()
            .then( res => {
                this.setState({klubber : res}) ;
            })
            .catch(err => console.log(err));

    }

    hentSesonger = async () => {
        const response = await fetch('/api/sesonger');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    hentKretser = async () => {
        const response = await fetch('/api/kretser');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    hentKlubber = async () => {
        const response = await fetch('/api/kretser/' + this.state.valgtKrets + '/klubber');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    hentTurneringer = async () => {
        const response = await fetch('/api/kretser/'    + this.state.valgtKrets + '/klubber/'
            + this.state.valgtKlubb + '/sesonger/'
            + this.state.valgtSesong + '/turneringer');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleValgtSesong(sesongId){
        this.setState({valgtSesong: sesongId},
            () => { if(this.state.valgtKlubb) {
                this.hentTurneringer()
                    .then(res => {
                        this.setState({turneringer: res});
                    })
                    .catch(err => console.log(err))
                }

            }
        );

    }

    handleValgtKrets(kretsId){
        this.setState({valgtKrets: kretsId});
        this.hentKlubber()
            .then( res => {
                this.setState({klubber : res}) ;
            })
            .catch(err => console.log(err));

    }

    handleValgtKlubb(klubbId){
        this.setState({valgtKlubb: klubbId},
            () => this.hentTurneringer()
                .then( res => {
                    this.setState({turneringer : res}) ;
                })
                .catch(err => console.log(err))
        )

    }


    handleValgtTurnering(turneringId){
        this.props.onChange(turneringId)
    }


    render() {
        return (
            <div>
                <h3>eller finn din klubbs turneringer</h3>
                <Sesongvelger value={this.state.valgtSesong} options={this.state.sesonger} onSesongChange={this.handleValgtSesong} />
                <Kretsvelger value={this.state.valgtKrets} options={this.state.kretser} onKretsChange={this.handleValgtKrets} />
                <Klubbvelger value={this.state.valgtKlubb} options={this.state.klubber} onKlubbChange={this.handleValgtKlubb} />
                <Turneringsknapper value={this.state.turneringer} onClick={this.handleValgtTurnering} />

            </div>
        );
    }
}

export default Turneringsoppslag;
