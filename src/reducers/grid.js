
import {SWAP_BLOCKS, DROP_BLOCK, INSERT_BLOCK, DELETE_BLOCK, CHECK_GRID, RESET_GAME, SET_HIGH, SET_VALUE, INC_VALUE, CALC_SCORE} from '../actions/grid'
import { value } from 'popmotion';


const initialState = {

    positions:{
        11:null, 12:null, 13:null, 14:null, 15:null, 16:null, 17:null,
        21:null, 22:null, 23:null, 24:null, 25:null, 26:null, 27:null,
        31:null, 32:null, 33:null, 34:null, 35:null, 36:null, 37:null,
        41:null, 42:null, 43:null, 44:null, 45:null, 46:null, 47:null,
        51:null, 52:null, 53:null, 54:null, 55:null, 56:null, 57:null
    },
    values:{
        
    },
    groups:[

    ],
    latestId: 99,
    score: 0,
    highScore: -1,
    gameOver: false

}



export default function reducer(state = initialState, action){

    function findPos(block){
        return Object.entries(state.positions).find(pair=> pair[1]===block)[0]
    }
    
    function getId(pos){
        return Object.entries(state.positions).find(pair=> pair[0]===pos)[1]
    }

    function getVal(pos){
        // const result =state.values[state.positions[pos]]
        // if(result === NaN){console.log(pos, state)}
        return state.values[state.positions[pos]]
    }

    function findAdjacentPos(pos, dir){
        // these limits will need to change when we expand the grid
        let y = parseInt(pos[0],10)
        let x = parseInt(pos[1],10)

        switch(dir){
            case 'left': x = x-1
            break;
            case 'right': x = x+1
            break;
            case 'up': y= y-1
            break;
            case 'down': y = y+1
            break;
        }

        if( x<1 || y<1 || x>7 || y>5 ){
            return 'out of bounds'}
        else {return `${y}${x}`}
    }

    function checkDir(pos, val, dir){
        // console.log(pos, val, dir)
        let posArr =[pos]
        for (var i = 0; i < posArr.length; i++) {
            let nextPose = findAdjacentPos(posArr[i], dir)
            if(getVal(nextPose)===val){posArr.push(nextPose)}
        }
        // console.log(posArr)
        return posArr
    }





    function checkGrid(){
        //returns false if block grid still updating, returns an array of match groups if matches found, otherwise returns empty array
        
        if(Object.values(state.positions).includes(null)){return false}

        let posList = Object.keys({...state.positions})
        let groups = []

        for (let i = 0; i < posList.length; i++) {
            let group = [posList[i]]
            let val = getVal(posList[i])

            
            for (let n  = 0; n < group.length; n++) {
                let left = checkDir(group[n], val, 'left')
                let right = checkDir(group[n], val, 'right')
                let up = checkDir(group[n], val, 'up')
                let down = checkDir(group[n], val, 'down')

                // console.log(group[n], val, left.length, right.length, up.length, down.length)
                if (left.length -1 + right.length -1 < 2 && up.length -1 + down.length -1 < 2 && n===0){
                    
                    group.splice(n,1)
                    
                }
                else{
                    if(left.length -1 + right.length -1 >= 2){
                        left.forEach(p => group.includes(p)? {} : group.push(p))
                        right.forEach(p => group.includes(p)? {} : group.push(p))
                    }
                    else if(up.length -1 + down.length -1 >= 2){
                        up.forEach(p => group.includes(p)? {} : group.push(p))
                        down.forEach(p => group.includes(p)? {} : group.push(p))
                    }
                }
        
            }
            group.forEach(p => posList.includes(p)? posList.splice(posList.indexOf(p),1) : {} )
            
            // group.length > 1 ?  console.log(val, group) : {}      
            groups.push(group)

        }
        let matches = groups.filter(arr => arr.length > 0)
        // console.log('matches',matches.length)
        if (matches.length === 0){
            const gameOver =checkGameOver()
            if(gameOver){
                groups = 'Game Over'

            } 
        }
        return groups
    }


    function getSurrounding(pos){
        // checkDir(pos, getVal(pos), 'left') remove this, it's for teting checkDir
        
        let y = parseInt(pos[0],10)
        let x = parseInt(pos[1],10)

        function outOfBounds(p){
            // console.log(p, Object.keys(state.positions).includes(p) )
            return Object.keys(state.positions).includes(p)
        }

        let xArr = [`${y}${x-2}`,`${y}${x-1}`,`${y}${x}`,`${y}${x+1}`,`${y}${x+2}`].filter(outOfBounds)
        let yArr = [`${y-2}${x}`,`${y-1}${x}`,`${y}${x}`,`${y+1}${x}`,`${y+2}${x}`].filter(outOfBounds)

        return [xArr, yArr]
    }

    function didMatch(pos1, pos2, newState){

        const sur1 = getSurrounding(pos1)
            .map(lArr =>{
                return lArr.map(pos =>{
                    return newState.values[newState.positions[pos]]
                })
            })
        // console.log('surrounding:', sur1)
        const sur2 = getSurrounding(pos2)
            .map(lArr =>{
                return lArr.map(pos =>{
                    return newState.values[newState.positions[pos]]
                })
            })

        let result = false

        let testList = sur1[0].concat(['']).concat(sur1[1]).concat(['']).concat(sur2[0]).concat(['']).concat(sur2[1])
        let v = ''
        let count = 1
        for (var i = 0; i < testList.length; i++) {
            if(testList[i] === v){
                count ++
                // console.log(count)
                count === 3 ? result = true : {}
            }
            else{
                v = testList[i]
                count = 1
            }
        }
        
        return result
    }

    function checkGameOver(){
        let swapOptions = []
        Object.keys(state.positions).forEach(pos1 =>{
            findAdjacentPos(pos1, 'right') === 'out of bounds' ? {} : swapOptions.push([pos1, findAdjacentPos(pos1, 'right')])
            findAdjacentPos(pos1, 'down') === 'out of bounds' ? {} : swapOptions.push([pos1, findAdjacentPos(pos1, 'down')])
        })
        // console.log(swapOptions)
        for (let i = 0; i < swapOptions.length; i++) {
            let pos1 = swapOptions[i][0]
            let pos2 = swapOptions[i][1]
            let newState = {...state, positions: 
                {...state.positions, 
                    [pos1]: state.positions[pos2], 
                    [pos2] : state.positions[pos1] }
                }
            if(didMatch(pos1, pos2, newState)){
                console.log(pos1, pos2)
                return false
            }
        }
        return true
    }

    if(action.type === INC_VALUE){
        // console.log(action.by)
        const newVal = getVal(action.position) + action.by
        // console.log('incrimenting from ',getVal(action.position),'to ', newVal, 'at', action.position)
        const pos = getId(action.position)

        return {...state, values: {...state.values, [pos]: newVal}}
    }

    if(action.type === SET_VALUE){
        return {...state, values: {...state.values, [getId(action.position)]: action.value}}
    }

    if(action.type === RESET_GAME){
        return {...initialState, highScore:state.highScore}
    }

    if(action.type === SWAP_BLOCKS){
        // console.log('blockId:', action.blockId, action.dir)
        let position1 = findPos(parseInt(action.blockId),10)
        // console.log (position1)
        let position2 = findAdjacentPos(position1, action.dir)
        
        let newState = {...state, positions: 
            {...state.positions, [position1]: state.positions[position2], [position2] : state.positions[position1] }
            }

        if(position2 ==='out of bounds'){return state}
        else if(didMatch(position1, position2, newState)===false){

            return state}
        else{ 
            return newState}
    }

    if(action.type === DROP_BLOCK){
        // console.log('drop to ', action.position)
        let position1 = action.position
        let position2 = findAdjacentPos(position1, 'up')
        return {...state, positions: 
            {...state.positions, [position1]: state.positions[position2], [position2] : state.positions[position1] }
        }
    }

    if(action.type === INSERT_BLOCK){
        //takes cell id, maybe block value
        let newId = state.latestId + 1

        let min = Infinity
        let max = 0

        Object.values(state.values).forEach(v => {
            v > max ? max = v : {}
            v < min ? min = v : {}
        })

        // this is sub-optimal in that it might return a low number if an extremely big combo occurs, but maybe that's fine?
        if(Object.values(state.values).length < 15){
            max = 4
            min = 1
        }

        const val = Math.floor(Math.random() * (max - min +1)) + min
        // console.log('inserting', val, 'at', action.position )
        return {...state, latestId: newId, 
            positions: {...state.positions , [action.position]: newId},
            values: {...state.values, [newId]:val}
        }

    }

    if (action.type === CHECK_GRID){

        // console.log('checking', state)
        const groups = checkGrid()
        if(groups === false || groups.length === 0){ return state}
        else if(groups === 'Game Over'){
            return {...state, gameOver: true}
        }
        else{
            return {...state, groups: groups}
        }
    }

    if(action.type === DELETE_BLOCK){
        // console.log('deleting id ', state.positions[action.position])
        let newVals = {...state.values}

        delete newVals[`${state.positions[action.position]}`]
        // console.log(newVals)
        return {...state, positions: {...state.positions, [action.position]: null}, values: newVals}
    }

    if(action.type === CALC_SCORE){
        const vals = Object.values(state.values)
        // console.log(vals)
        let highest = 0
        vals.forEach(v => v > highest ? highest = v :{})
        return {...state, score: highest}
    }

    if(action.type === SET_HIGH){

        return{...state, highScore: action.score}
    }

    return state
}
