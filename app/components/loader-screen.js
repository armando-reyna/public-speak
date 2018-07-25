import React, { Component } from 'react';
import {
  View,
  Text,
  Animated,
  Easing
} from 'react-native';
import Button from './button';
import Svg,{
    Circle,
    Line,
} from 'react-native-svg';
export default class LoaderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transformLeftTranslate: new Animated.Value(0),
            transformRightTranslate: new Animated.Value(0),
            transformLeftScale: new Animated.Value(1),
            transformRightScale: new Animated.Value(1),
            transformActions: new Animated.Value(0),
            transformTop: new Animated.Value(0),
            backgroundColor: new Animated.Value(0),
            opacity: new Animated.Value(0),
            transformDoneScale: new Animated.Value(1),
            transformMainTop: new Animated.Value(0),
            showDoneIcon: false,
            done: false,
            status: null,
            errorText: null
        }
    }
    animateLeftCircle() {
        Animated.sequence([
            Animated.timing(this.state.transformLeftTranslate, {
                toValue: 0,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            }),
            Animated.timing(this.state.transformLeftTranslate, {
                toValue: 50,
                easing: Easing.linear,
                useNativeDriver: true,
                delay: 500
            }),
            Animated.timing(this.state.transformLeftTranslate, {
                toValue: 0,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 800
            })
        ]).start(() => {});
        Animated.sequence([
            Animated.timing(this.state.transformLeftScale, {
                toValue: 1,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            }),
            Animated.timing(this.state.transformLeftScale, {
                toValue: .5,
                easing: Easing.linear,
                useNativeDriver: true,
                delay: 500
            }),
            Animated.timing(this.state.transformLeftScale, {
                toValue: .8,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            }),
            Animated.timing(this.state.transformLeftScale, {
                toValue: 1,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            })
        ]).start(() => {
            if (this.state.done)
                return;
            else
                this.animateLeftCircle();
        });
    }
    animateRightCircle() {
        Animated.sequence([
            Animated.timing(this.state.transformRightTranslate, {
                toValue: 0,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            }),
            Animated.timing(this.state.transformRightTranslate, {
                toValue: -50,
                easing: Easing.linear,
                useNativeDriver: true,
                delay: 500
            }),
            Animated.timing(this.state.transformRightTranslate, {
                toValue: 0,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 800
            })
        ]).start(() => {});
        Animated.sequence([
            Animated.timing(this.state.transformRightScale, {
                toValue: 1,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            }),
            Animated.timing(this.state.transformRightScale, {
                toValue: .5,
                easing: Easing.linear,
                useNativeDriver: true,
                delay: 500
            }),
            Animated.timing(this.state.transformRightScale, {
                toValue: .8,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            }),
            Animated.timing(this.state.transformRightScale, {
                toValue: 1,
                easing: Easing.linear,
                useNativeDriver: true,
                duration: 500
            })
        ]).start(() => {
            if (this.state.done)
                this.animate();
            else
                this.animateRightCircle();
        });
    }
    animate() {
        if (this.state.done) {
            this.setState(state => {
                state['showDoneIcon'] = true;
                return state;
            })
            Animated.sequence([
                Animated.timing(this.state.backgroundColor, {
                    duration: 0,
                    toValue: 0,
                    easing: Easing.linear,
                }),
                Animated.timing(this.state.backgroundColor, {
                    duration: 500,
                    toValue: 1,
                    easing: Easing.linear,
                })
            ]).start();
            Animated.sequence([
                Animated.timing(this.state.transformDoneScale, {
                    delay: 500,
                    duration: 0,
                    toValue: 1,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.transformDoneScale, {
                    duration: 500,
                    toValue: 1.4,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.transformDoneScale, {
                    duration: 1000,
                    toValue: 1,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.transformDoneScale, {
                    duration: this.props.auto ? this.props.auto.delay : 0,
                    toValue: 1,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ]).start(() => {
                this.props.auto ? (this.state.status === 'success' ? (this.props.auto.success ? this.props.auto.success() : null) : (this.props.auto.error ? this.props.auto.error() : null)) : null;
            });
            Animated.timing(this.state.transformActions, {
                duration: 500,
                toValue: 1,
                easing: Easing.linear,
                useNativeDriver: true,
                delay: 500
            }).start();
            Animated.timing(this.state.transformTop, {
                duration: 500,
                toValue: -150,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        } else {
            this.animateLeftCircle();
            this.animateRightCircle();
        }
        
    }
    componentDidMount() {
        this.animate();
        Animated.timing(this.state.opacity, {
            duration: 500,
            toValue: 1
        }).start();
    }
    success(message) {
        this.setState(state => {
            state.done = true;
            state.status = 'success';
            if (message)
                state.successText = message;
            return state;
        })
    }
    error(message) {
        this.setState(state => {
            state.done = true;
            state.status = 'error';
            if (message)
                state.errorText = message;
            return state;
        })
    }
    reset() {
        this.setState(state => {
            state.transformLeftTranslate = new Animated.Value(0),
            state.transformRightTranslate = new Animated.Value(0),
            state.transformLeftScale = new Animated.Value(1),
            state.transformRightScale = new Animated.Value(1),
            state.transformActions = new Animated.Value(0),
            state.transformTop = new Animated.Value(0),
            state.backgroundColor = new Animated.Value(0),
            state.opacity = new Animated.Value(0),
            state.transformDoneScale = new Animated.Value(1),
            state.transformMainTop = new Animated.Value(0),
            state.showDoneIcon = false,
            state.done = false,
            state.status = null,
            state.errorText = null
            return state;
        }, () => {
            this.componentDidMount();
        })
    }
    exit() {
        return new Promise(resolve => {
            Animated.timing(this.state.opacity, {
                duration: 500,
                toValue: 0
            }).start(() => {
                if (this.props.onExit)
                    this.props.onExit();
                resolve()
            });
        });
    }
    render() {
        let backgroundColor = this.state.backgroundColor.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(255, 255, 255, 0.8)',  'rgba(51, 82, 103, 1)']
        });
        this.props.reference ? this.props.reference(this) : null;
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                flex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            }}>
                <Animated.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: backgroundColor,
                    opacity: this.state.opacity
                }}>
                    <Animated.View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: 'rgba(51, 82, 103, 1)',
                        marginTop: 50,
                        transform: [{
                            translateX: this.state.transformLeftTranslate
                        }, {
                            translateY: this.state.transformTop
                        }, {
                            scale: this.state.transformLeftScale
                        }]
                    }}/>
                    <Animated.View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: '#D75F77',
                        marginTop: -50,
                        transform: [{
                            translateX: this.state.transformRightTranslate,
                        }, {
                            translateY: this.state.transformTop
                        }, {
                            scale: this.state.transformRightScale
                        }]
                    }}/>
                    <Animated.View style={{
                        width: 52,
                        height: 52,
                        marginTop: -52,
                        transform: [{
                            translateY: this.state.transformTop
                        }, {
                            scale: this.state.transformDoneScale
                        }]
                    }}>
                        { this.state.showDoneIcon && this.state.status === 'success' && 
                            <Svg 
                                viewBox="0 0 52 52" 
                                height="52"
                                width="52"
                            >
                                <Circle cx={26} cy={26} r={25} fill={'#D75F77'} />
                                <Line x1={20} y1={36} x2={13} y2={30} stroke='white' strokeWidth={2}/>
                                <Line x1={38} y1={16} x2={20} y2={36} stroke='white' strokeWidth={2}/>
                            </Svg>
                        }
                        { this.state.showDoneIcon && this.state.status === 'error' && 
                            <Svg 
                                viewBox="0 0 52 52" 
                                height="52"
                                width="52"
                            >
                                <Circle cx={26} cy={26} r={25} fill={'#D75F77'} />
                                <Line x1={16} y1={16} x2={35} y2={35} stroke='white' strokeWidth={2}/>
                                <Line x1={36} y1={16} x2={16} y2={36} stroke='white' strokeWidth={2}/>
                            </Svg>
                        }
                    </Animated.View>
                    <Animated.View style={{
                        width: '100%',
                        position: 'absolute',
                        top: '50%',
                        transform: [{
                            translateY: -50
                        }],
                        opacity: this.state.transformActions
                    }}>
                        { (this.props.successText || this.props.errorText || this.state.errorText || this.state.successText) && <Text style={{
                            marginTop: 20,
                            fontSize: 24,
                            color: 'white',
                            textAlign: 'center'
                        }}>{ this.state.status === 'success' ? (this.state.successText ? this.state.successText : this.props.successText) : (this.state.errorText ? this.state.errorText : this.props.errorText) }</Text>}
                        { this.state.status === 'success' && this.props.successButton && this.props.successButtonText &&
                            <Button onPress={() => this.props.successButton()} style={{ width: '100%', marginTop: 100 }} text={this.props.successButtonText}/>
                        }
                        { this.state.status === 'error' && this.props.errorButton && this.props.errorButtonText &&
                            <Button onPress={() => this.props.errorButton()} style={{ width: '100%', marginTop: 100 }} text={this.props.errorButtonText}/>
                        }
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }
}
