import React, { Component } from 'react';
import Sugestion from './Sugestion';
import Sugestions from './Sugestions'

const InputCons = props => {
    return (
        <input 
          {...props}
          ref={(input) => props.inputRef(input)}
          type="text" 
          autoComplete='off'/>
    ); 
};

class InputAutoSugest extends Component {
    constructor (props) {
        super(props)
        this.state = {
          activedIndex: -1,
          filteredData : [],
          data: this.getData(props.data)
        }

        String.prototype.bold = function (bold) {
            const indexOfSearch = this.toLowerCase().indexOf(bold.toLowerCase());

            if( indexOfSearch >= 0 ){
                return (
                    <div>
                        {this.substr(0, indexOfSearch)}<b>{this.substr(indexOfSearch, bold.length)}</b>{this.substr(indexOfSearch+bold.length)}
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

    componentWillReceiveProps(nextProps){
        if(nextProps.data) {
            let data = this.getData(nextProps.data)
            if(nextProps.data != data) {
                this.setState({data: data})
            }
        }
    }
    
    getData(propData) {
        return propData.map((item) => {
            return {
                getSugestion: () => this.display(item, this.props.value),
                originalData: item
        }})
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

        if(hasSpecialDisplayTreatment) {
            const displayItem = this.props.display(item);
            const isStringType = typeof displayItem === 'string';

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
            case 'Escape':
                this.setState({filteredData: []})
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
                return filter ? filter(item) : item.toLowerCase().indexOf(search.toLowerCase())>=0}
            );
        }

        this.setState({filteredData: filteredData});

        onChange(e);
    }

    handleOnBlur = () => {
        this.setState({filteredData: []})
        if(this.props.onBlur){
            this.props.onBlur()
        }
    }

    focus() {
        this.inputRef.focus()
    }

    render() {
        const {activedIndex, filteredData} = this.state;
        return (
            <React.Fragment>
                <InputCons 
                  {...this.props}
                  inputRef={(inputRef) => this.inputRef = inputRef}
                  onChange={this.handleInputOnChange} 
                  onKeyDown={this.handleOnKeyDown}
                  onBlur={this.handleOnBlur}/>
                  
                <Sugestions
                  style={this.props.style}
                  onClick={this.handleSelect}
                  activedIndex={activedIndex}>
                    {filteredData}
                </Sugestions>
            </React.Fragment>
        );
    }
}

export default InputAutoSugest;