import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    Animated,
    AnimatedValue,
    Keyboard,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { v } from '../constants/validations';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focus: false,
            placeholderTop: new Animated.Value(20),
            placeholderSize: new Animated.Value(16),
            hidePassword: true,
            error: false
        };
    }
    updateState(name, value) {
        this.setState(state => {
            state[name] = value;
            return state;
        });
    }
    focus() {
        if (!this.state.focus) {
            this.onFocus(false);
            this.input.focus();
        }
    }
    value() {
        if (this.state.error)
            return false;
        return this.state.value;
    }
    error(value) {
        this.updateState('error', value);
    }
    onFocus(value) {
        this.updateState('focus', value);
        // if (!this.state.focus && this.props.password)
        //     this.clearValue();
        if (this.state.focus && !this.state.value) {
            Animated.timing(this.state.placeholderTop, {
                toValue: 20,
                timing: 100
            }).start();

            Animated.timing(this.state.placeholderSize, {
                toValue: 16,
                timing: 100
            }).start()
        } else {
            Animated.timing(this.state.placeholderTop, {
                toValue: -10,
                timing: 100
            }).start();

            Animated.timing(this.state.placeholderSize, {
                toValue: 12,
                timing: 100
            }).start()
        }
    }
    validate(value) {
        if (this.props.type === 'email-address') {
            if (v.email(value) || !value) {
                this.updateState('error', false);
            } else {
                this.updateState('error', true);
            }
            value = v.email(value) ? value : null;
        } else if (this.props.compare && this.state.value !== this.props.compare) {
            this.updateState('error', true);
        } else {
            this.updateState('error', false);
        }
        return value;
    }
    setValue(text) {
        this.updateState('value', text);
        text = this.validate(text);
        if (this.props.onChange)
            this.props.onChange(text);
    }
    togglePassword() {
        Keyboard.dismiss();
        this.updateState('hidePassword', !this.state.hidePassword);
    }
    clearValue(focus) {
        this.setValue('');
        this.updateState('iconDown', false);
        if (typeof focus === 'undefined' || focus)
            this.input.focus();
    }
    iconPressed(touch) {
        this.updateState('iconDown', touch);
        switch(this.props.icon) {
            case 'remove-red-eye':
                this.togglePassword();
            break;
            case 'cancel':
                this.clearValue();
            break;
        }
    }
    render() {
        const {
            type,
            placeholder,
            password,
            icon,
            next,
            reference,
            ref,
            returnKeyType
        } =  this.props;
        let textInput = (
            <View>
                <TextInput
                    keyboardType={ type }
                    secureTextEntry={ password ? this.state.hidePassword : false }
                    style={styles.input}
                    underlineColorAndroid='transparent'
                    onFocus={ () => this.onFocus(true) }
                    onBlur={ () => this.onFocus(false) }
                    onChangeText={ (value) => this.setValue(value) }
                    value={this.state.value}
                    returnKeyType = { returnKeyType }
                    onSubmitEditing={() => {
                        if (this.state.error || !this.state.value) {
                            this.input.focus();
                            return false;
                        }
                        else if(next)
                            next();
                    }}
                    ref={(input) => {
                        this.input = input;
                        if (reference)
                            reference(input)
                        if (ref)
                            ref(input)
                    }}
                />
                <View style={{
                    backgroundColor: this.state.error && !this.state.focus ? '#DB8711' : (this.state.focus ? '#D75F77' : 'rgba(0,0,0,0.54)'),
                    width: '100%',
                    position: 'absolute',
                    bottom: 7,
                    left: 0,
                    right: 0,
                    height: this.state.value ? 2 : 1
                }}/>
            </View>
        ), iconContainer, placeholderContainer;
        if (icon && this.state.value && (this.state.focus || password)) {
            iconContainer = (
                <Icon
                    style={{
                        backgroundColor: 'white',
                        textAlign: 'right',
                        width: 40,
                        position: 'absolute',
                        top: '50%',
                        marginTop: -12,
                        right: 0,
                        color: (this.state.iconDown ? '#D75F77' : 'rgba(0,0,0,0.54)'),
                        fontSize: 24
                    }}
                    name={icon}
                    onStartShouldSetResponder={() => true}
                    onResponderStart={() => this.iconPressed(true)}
                    onResponderEnd={() => this.iconPressed(false)}
                />
            );
        }
        if (placeholder) {
            placeholderContainer = (
                <Animated.Text style={{
                    color: (this.state.error && !this.state.focus ? '#DB8711' : 'rgba(0,0,0,0.54)'),
                    fontFamily: "EuphemiaUCAS",
                    fontSize: this.state.placeholderSize,
                    left: 10,
                    position: 'absolute',
                    top: 0,
                    marginTop: this.state.placeholderTop
                }}>{ placeholder }</Animated.Text>
            );
        }
        return (
            <View 
                style={styles.container}
            >
                { placeholderContainer }
                { textInput }
                { iconContainer }
                { this.state.error && !this.state.focus &&
                    <Text style={ styles.error }>{ this.props.errorMessage }</Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 0,
        marginTop: 20,
        marginBottom: 20
    },
    input: {
        padding: 20,
        paddingLeft: 10,
        paddingRight: 40,
        width: '100%',
        fontSize: 16,
        margin: 0,
        marginBottom: 0,
        color: 'rgba(0,0,0,0.87)',
        fontFamily: "EuphemiaUCAS"
    },
    error: {
        fontSize: 12,
        paddingLeft: 10,
        color: '#DB8711',
        fontFamily: "EuphemiaUCAS"
    }
});
