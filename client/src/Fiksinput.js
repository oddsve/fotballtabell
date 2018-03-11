import React, { Component } from 'react';


class Fiksinput extends Component {

    constructor(props) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
        this.state = {value:null}
    }



    handleBlur(event){
        var myRe = /(\d+)(?!.*\d)/g;
        let turneringId = myRe.exec(event.target.value)[0];
        this.props.onChange(turneringId);
    }


    render() {
        return (
            <form >
                <h3>Legg inn fiks-id</h3>
                <input type="text" onBlur={this.handleBlur}/>
            </form>
        );
    }
}

export default Fiksinput;