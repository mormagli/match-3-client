import React, { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';
import { connect } from 'react-redux';

import {spring} from 'popmotion';

import {swapBlocks, deleteBlock} from '../actions/grid';


// const looseSpring = (props) =>
//   spring({ ...props, stiffness: 200, damping: 0 })

const Item = posed.div({
    draggable: true,
    dragBounds: { left: -60, right: 60, top: -60, bottom: 60 },
    dragEnd: {transition: spring }
});




export class Block extends Component{
    constructor(){
        super();
        this.state = { direction: '' }
       }


    
    xVal;
    yVal;

    setX(x){this.xVal = x}
    setY(y){this.yVal = y}



    
    getDirection(){
        let id = this.props.id
        // console.log(id, this.xVal, this.yVal)
        
        if (Math.abs(Math.abs(this.xVal)-Math.abs(this.yVal)) >= 25){
            let direction = ''
            if(Math.abs(this.xVal) > Math.abs(this.yVal) && this.xVal > 0){direction='right'}
            else if(Math.abs(this.xVal) > Math.abs(this.yVal) && this.xVal < 0){direction='left'}
            else if(Math.abs(this.xVal) < Math.abs(this.yVal) && this.yVal > 0){direction='down'}
            else if(Math.abs(this.xVal) < Math.abs(this.yVal) && this.yVal < 0){direction='up'}

            this.props.dispatch(swapBlocks(id, direction))
        }
    }

    render(){
        

        return (
            <Item  id={this.props.id} 
            value={this.props.value}
            className='item'
            // onValueChange={{ x: x => console.log('x',x),
            //     y: y => console.log('y',y)
            // }}
            onValueChange={{ x: x => this.setX(x),
            y: y => this.setY(y)
            }}
            onDragEnd ={()=>this.getDirection()}
            // onClick={()=> this.removeBlock()}
            >
                {this.props.value}
            </Item>
        )
    }

};

const mapStateToProps = state => {
    return {
        grid: state.grid.positions
    };
  };

export default (connect(mapStateToProps)(Block));