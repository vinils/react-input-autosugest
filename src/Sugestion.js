import React, { Component } from 'react';
import PropTypes from 'prop-types'

const hover = {
    backgroundColor: '#f1f1f1',
    cursor: 'pointer'
}

const active = {
    backgroundColor: 'dodgerblue',
    color: '#ffffff'
}

const style = {
    padding: '7px',
    fontSize: '16px',
    fontWeight: 100,
    hover: hover,
    active: active
}

const LiCons = props => {
    const _style = {...style, ...props.style};

    return (
        <li
          style={ props.actived ? {..._style, ...style.active, ..._style.active} : props.hovered ? {..._style, ...style.hover, ..._style._hover} : _style }
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          onMouseDown={props.onClick}>
            {props.children}
        </li>
    ); 
};

class Sugestion extends Component {
    constructor (props) {
        super(props)
        this.state = {
            hovered: false,
          actived: false
        }
    }

    handleOnMouseEnter = (e) => {
        this.setState({hovered: true});
    }
    
    handleOnMouseLeave = (e) => {
        this.setState({hovered: false});
    }
    
    render() {
        const {actived, children, onClick, style} = this.props;
        const {hovered} = this.state;

        return (
            <LiCons
              style={style} 
              hovered={ hovered ? true : false } 
              actived={ actived ? true : false } 
              onMouseEnter={this.handleOnMouseEnter}
              onMouseLeave={this.handleOnMouseLeave}
              onClick={onClick}>
                {children}
            </LiCons>
        );
    }
}

Sugestion.propTypes = {
    // key: PropTypes.number.isRequired,
    // text: PropTypes.string.isRequired
}

export default Sugestion