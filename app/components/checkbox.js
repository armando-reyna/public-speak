import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked
        }
    }
    toggle() {
        this.setState(state => {
            state['checked'] = !this.state.checked;
            this.props.onPress(state.checked);
            return state;
        });
    }
    render() {
        let icon = 'check-box';
        let checkColor = '#D75F77';
        if (!this.state.checked) {
            checkColor = 'rgba(0,0,0,0.54)';
            icon += '-outline-blank'
        } 
        return (
            <View
                style={this.props.style}
                onStartShouldSetResponder={() => true}
                onResponderEnd={() => this.toggle()}
            >
                <Icon style={styles.icon} name={icon} color={checkColor} />
                { this.props.text &&
                    <View
                        style={styles.labelContainer}
                    >
                        <Text style={styles.label}>{ this.props.text }</Text>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    labelContainer: {
        marginLeft: 10,
    },
    label: {
        color: 'rgba(0,0,0,0.54)',
        fontFamily: "EuphemiaUCAS",
        fontSize: 12,
        lineHeight: 24
    },
    icon: {
        fontSize: 24
    }
});
