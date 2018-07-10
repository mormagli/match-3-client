import React from 'react';
import { connect } from 'react-redux';


export class Score extends React.Component {
    constructor(){
        super();
        this.state = { }
       }

    render(){



        
        return(
           
               [ <div className="score  btn-lg btn-info">
                    High#: 
                    <span className="badge">{this.props.score}</span>
                </div>,
                <div className="score high-score btn-lg btn-info">
                    Best: 
                    <span className="badge">{this.props.score > this.props.highScore ? this.props.score : this.props.highScore}</span>
        </div> ]
            
            
        )    
    }
}

const mapStateToProps = state => {
    // console.log('mapping')
    return {
        score: state.grid.score,
        highScore: state.grid.highScore
    };
  };

export default (connect(mapStateToProps)(Score));