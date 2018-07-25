import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked
        }
    }
    update(params) {
        if (this.state.checked && this.props.index !== params.index)
            this.toggle(true);
    }
    componentDidMount() {
        DeviceEventEmitter.addListener('radioGroup-' + this.props.name, (params) => {
            this.update(params);
        });
    }
    componentWillUnmount() {
        DeviceEventEmitter.removeListener('radioGroup-' + this.props.name)
    }
    toggle(emulated) {
        this.setState(state => {
            state['checked'] = !this.state.checked;
            if (state['checked']) {
                DeviceEventEmitter.emit('radioGroup-' + this.props.name, {
                    index: this.props.index
                });
            }
            if (this.props.onPress && !emulated)
                this.props.onPress(state.checked);
            return state;
        });
    }
    render() {
        let icon = 'radio-button-';
        let checkColor = this.props.enabledColor ? this.props.enabledColor :  '#D75F77';
        if (!this.state.checked) {
            checkColor = this.props.disabledColor ? this.props.disabledColor : 'rgba(255,255,255,.5)';
            icon += 'unchecked';
        } else {
            icon += 'checked';
        }
        this.props.reference ? this.props.reference(this) : null;
        return (
            <TouchableOpacity
                onPress={() => {
                    this.toggle();
                }}
            >
                <View 
                    style={[{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    }, this.props.style]}
                >
                    <Icon style={this.props.iconStyle} size={24} name={icon} color={checkColor} />
                    <Text style={[{
                        color: '#FFFFFF',
                        fontFamily: 'EuphemiaUCAS-Bold',
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 20,
                        marginLeft: 15,
                        width: Dimensions.get('screen').width - 80
                    }, this.props.labelStyle]}>{ this.props.label }</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
