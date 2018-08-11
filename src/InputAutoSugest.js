import React, { Component } from 'react';
import Sugestion from './Sugestion';
import Sugestions from './Sugestions'

const InputCons = props => {
    return (
        <input 
          type="text" 
          name={props.name}
          placeholder={props.placeholder}
          size={props.size} 
          onChange={props.onChange}
          onKeyDown={props.onKeyDown} 
          value={props.value}/>
    ); 
};

class InputAutoSugest extends Component {
    constructor (props) {
        super(props)
        this.state = {
          activedIndex: -1,
          filteredData : [],
          data: props.data.map((item) => {
            return {
                getSugestion: () => this.display(item, this.props.value),
                originalData: item
            }})
          
        }

        String.prototype.bold = function (bold) {
            const indexOfSearch = this.indexOf(bold);

            if( indexOfSearch >= 0 ){
                return (
                    <div>
                        {this.substr(0, indexOfSearch)}<b>{bold}</b>{this.substr(indexOfSearch+bold.length)}
                    </div>
                );
            } else {
                return this;
            }
        };

        Array.prototype.where = function(condition) {
            var ret = [];
            
            for(let i = 0; i < this.length; i++){
                if(condition(this[i].originalData)){
                    ret.push(this[i]);
                }
            }
    
            return ret;
        }
    }

    handleSelect = (idx) => {
        const {name, onChange} = this.props;
        const e = {
            target: {
                name: name,
                value: this.state.filteredData[idx].originalData
            }
        }

        this.setState({
            // InputAutoSugest: this.state.filteredData[idx].originalData,
            filteredData: []
        })

        onChange(e);
    }

    display(item, search){
        const hasAnySearch = search;
        const hasSpecialDisplayTreatment = this.props.display;

        if(hasSpecialDisplayTreatment){
            const displayItem = this.props.display(item);
            const isStringType = typeof displayItem == 'String';

            if(hasAnySearch && isStringType){
                return displayItem.bold(search)
            } else {
                return displayItem;
            }
        } else {
            if(hasAnySearch){
                return item.bold(search);
            } else {
                return item;
            }
        }
    }

    handleOnKeyDown = (e) => {
        const {activedIndex, filteredData} = this.state;
        
        switch(e.key){
            case 'ArrowUp':
                e.preventDefault();
                if(activedIndex > 0)
                    this.setState({activedIndex: activedIndex-1})
                break;
            case 'ArrowDown':
                if(activedIndex < filteredData.length-1)
                    this.setState({activedIndex: activedIndex+1})
                break;
            case 'Enter':
                if(activedIndex != -1)
                    this.handleSelect(activedIndex);
                break;
            default:
                if(activedIndex != -1)
                    this.setState({activedIndex: -1})
        }
    }

    handleInputOnChange = (e) =>{
        const search = e.target.value;
        const {filter, onChange} = this.props;
        var filteredData = [];

        if(search) {
            filteredData = this.state.data.where((item)=>{
                return filter ? filter(item) : item.indexOf(search)>=0}
            );
        }

        this.setState({filteredData: filteredData});

        onChange(e);
    }

    render() {
        const {activedIndex, filteredData} = this.state;
        const {name, placeholder, value, size} = this.props;
        return (
            <React.Fragment>
                <InputCons 
                  name={name} 
                  placeholder={placeholder}
                  value={value} 
                  size={size}
                  onChange={this.handleInputOnChange} 
                  onKeyDown={this.handleOnKeyDown}/>
                  
                <Sugestions
                  onClick={this.handleSelect}
                  activedIndex={activedIndex}>
                    {filteredData}
                </Sugestions>
            </React.Fragment>
        );
    }
}

export default InputAutoSugest;