import React, { Component } from 'react';
import posed from 'react-pose';
import { connect } from 'react-redux';

import {spring, tween} from 'popmotion';

import {swapBlocks} from '../actions/grid';


// const looseSpring = (props) =>
//   spring({ ...props, stiffness: 200, damping: 0 })

// let width = 77 

// transition: ({ i }) => ({ delay: i * 50 })

const Item = posed.li({
    draggable: true,
    centered: {},
    left: {x: ({w}) => {  return  -(w) }},
    right: {x: ({w}) => { return (w) }},
    up: {y: ({w}) => { return -(w) }},
    down: {y: ({w}) => { return (w) }},
    down: {y: 65},
    dragBounds: { left: -65, right: 65, top: -65, bottom: 65 },
    dragEnd: {transition: spring },
    flip: {transition: tween},
    props: {w:0}
});



// const Item = posed.li({
//   flip: {
//     transition: tween
//   }
// })


export class Block extends Component{
    constructor(){
        super();
        this.state = { direction: '', dragging:false, swapping:false, width:0 }
       }


    
    xVal;
    yVal;

    setX(x){this.xVal = x}
    setY(y){this.yVal = y}


    clickTest(){
    console.log('clicking')

    // var element = document.getElementById(`${this.props.id}`)

    // console.log(document.getElementById(this.props.id).offsetHeight)
    // this.setState({triggered:!this.state.triggered})
    
    }

    componentDidUpdate(prevProps) {
        if (this.props.swap[this.props.parId] !== prevProps.swap[this.props.parId]) {
            // console.log(this.state)
            this.setState({swapping: this.props.swap[this.props.parId]})

        }
    }

    componentDidMount(){
        // console.log(document.getElementById(this.props.id).offsetHeight)
        this.setState({width:document.getElementById(this.props.id).offsetHeight})
    }
    // checkCell(){
    //     // console.log('firing', this.props.grid[this.props.id])
    //     // this.props.dispatch(insertBlock(this.props.id))
    //     if(this.props.value===null){
    //         // console.log(this.props.id[0])
    //         if(this.props.id[0]==='1'){
    //             // console.log('insertingat ' , this.props.id)
    //             this.props.dispatch(insertBlock(this.props.id))}
    //         else{
    //             // console.log('dropping at', this.props.id)
    //             this.props.dispatch(dropBlock(this.props.id))
    //         }
    //     }
    //     // else{
    //     //     this.setState({insert:(
    //     //         <Block id={this.props.grid[this.props.id]} className='block'/>
    //         // )})
    //     // }
        
    // }


    // componentDidMount(){this.checkCell()}
    
    getDirection(){
        let id = this.props.id
                
        if (Math.abs(Math.abs(this.xVal)-Math.abs(this.yVal)) >= 25){
            let direction = ''
            if(Math.abs(this.xVal) > Math.abs(this.yVal) && this.xVal > 0){direction='right'}
            else if(Math.abs(this.xVal) > Math.abs(this.yVal) && this.xVal < 0){direction='left'}
            else if(Math.abs(this.xVal) < Math.abs(this.yVal) && this.yVal > 0){direction='down'}
            else if(Math.abs(this.xVal) < Math.abs(this.yVal) && this.yVal < 0){direction='up'}

            this.props.dispatch(swapBlocks(id, direction))
        }
    }

    startDragging(){
        this.setState({dragging:true})
    }

    stopDragging(){
        this.setState({dragging:false})
    }
    render(){
        let color = this.props.value;
        while(color> 9){color = color-9}

        return (
            
            <Item  id={this.props.id}
            
            key={this.props.id}
            value={this.props.value}
            className={`item item-${color} btn btn-lg btn-default ${this.state.dragging ? 'dragging' : ''}` }
            pose={!this.state.swapping ? 'centered' : this.props.swap[this.props.parId] }
            onClick={()=> this.clickTest()}
            w={this.state.width}
            onDragStart={()=> this.startDragging()}
            onValueChange={{ x: x => this.setX(x), y: y => this.setY(y) }}
            onDragEnd ={()=>{
                this.stopDragging()
                this.getDirection()}}
            >
                <div className="item-value"> {this.props.value} </div>
            </Item>
        )
    }

};

const mapStateToProps = state => {
    return {
        grid: state.grid.positions,
        values: state.grid.values,
        swap: state.grid.swapping
    };
  };

export default (connect(mapStateToProps)(Block));