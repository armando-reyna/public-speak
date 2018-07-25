import React, { Component } from 'react';

import moment from 'moment';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            pressed: false,
            latitude: null,
            longitude: null,
            distanceValidation: false,
            isNear: null,
            timeValidation: false,
            inTime: null
        }
    }
    distance(lat1, lon1, lat2, lon2, unit) {
        let radlat1 = Math.PI * lat1/180
        let radlat2 = Math.PI * lat2/180
        let theta = lon1-lon2
        let radtheta = Math.PI * theta/180
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist *= 180/Math.PI
        dist *= 60 * 1.1515
        if (unit=='K') { dist *= 1.609344 }
        if (unit=='N') { dist *= 0.8684 }
        return dist
    }
    validateAvailability() {
        let inTime = false
        if (this.props.enabledAt && this.props.disabledAt) {
            if (moment().diff(this.props.enabledAt) > 0 && moment().diff(this.props.disabledAt) < 0) {
                inTime = true
            }
        } else if (this.props.enabledAt) {
            if (moment().diff(this.props.enabledAt) > 0) {
                inTime = true
            }
        } else if (this.props.disabledAt) {
            if (moment().diff(this.props.disabledAt) < 0) {
                inTime = true
            }
        }
        this.setState({
            inTime: inTime
        });
        if (this.state.distanceValidation && this.state.isNear && this.state.inTime) {
            this.setState({
                disabled: false
            });
        } else if (!this.state.distanceValidation) {
            if (this.state.inTime) {
                this.setState({
                    disabled: false
                })
            } else {
                this.setState({
                    disabled: true
                })
            }
        }
    }
    enable() {
        this.setState({
            disabled: false
        })
    }
    disable() {
        this.setState({
            disabled: true
        })
    }
    componentDidMount() {
        this.setState({
            disabled: this.props.disabled
        });
        if (this.props.enabledAt || this.props.disabledAt) {
            this.setState({
                timeValidation: true
            });
            this.validateAvailability();
            this.timer = BackgroundTimer.setInterval(() => {
                this.validateAvailability();
            }, 1000);
        }
        if (this.props.lat && this.props.lon) {
            this.setState({
                distanceValidation: true
            });
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    let distance = this.distance(position.coords.latitude, position.coords.longitude, this.props.lat, this.props.lon, 'K');
                    if (distance < .2) {
                        this.setState({
                            isNear: true
                        })
                    } else {
                        this.setState({
                            isNear: false
                        })
                    }
                    if (this.state.timeValidation && this.state.inTime && this.state.isNear) {
                        this.setState({
                            disabled: false
                        });
                    } else if (!this.state.timeValidation) {
                        if (this.state.isNear) {
                            this.setState({
                                disabled: false
                            })
                        } else {
                            this.setState({
                                disabled: false
                            })
                        }
                    }
                },
                (error) => { console.error(error); },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000, distanceFilter: 2 },
            );
        }
        if (this.props.reference)
            this.props.reference(this);
    }
    componentWillUnmount() {
        BackgroundTimer.clearTimeout(this.timer);
        if (this.watchId)
            navigator.geolocation.clearWatch(this.watchId);
    }
    press() {
        this.setState(state => {
            state.pressed = !this.state.pressed;
            return state;
        })
    }
    onPress() {
        if (this.props.onPress && !this.state.disabled)
            this.props.onPress();
    }
    render() {
        return (
            (
                ((this.state.distanceValidation || this.state.timeValidation) && (this.props.showAtDisabled || !this.state.disabled))
                ||
                ((!this.state.distanceValidation && !this.state.timeValidation) && (this.props.showAtDisabled || !this.state.disabled))
            )
            &&
            <TouchableOpacity
                activeOpacity={.8}
                onStartShouldSetResponder={() => true}
                onResponderStart={() => this.press()}
                onResponderEnd={() => this.press()}
                onPress={() => this.onPress()}
                style={[{
                    flexDirection: 'row',
                    marginTop: 30,
                    borderRadius: 100,
                    backgroundColor: (this.props.secondary ? (
                            this.state.disabled ? 'transparent' : (this.state.pressed ? '#F9E6EB' : 'transparent')
                        ) : (
                            this.state.disabled ? '#D5D3D3' : (this.state.pressed ? '#C04C61' : '#D75F77')
                        )
                    ),
                    shadowColor: (this.props.secondary ? 'transparent' : 'rgba(0,0,0,0.24)'),
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                }, this.props.style]}
            >
                <Icon name={this.props.icon} size={18} style={{
                    color: (this.state.disabled ? 
                        'rgba(0,0,0,.26)'
                        :
                        (this.props.secondary ? '#D75F77' : 'rgba(255,255,255,0.87)')
                    ),
                    marginRight: 5
                }}/>
                <Text style={{
                    color: (this.state.disabled ? 
                        'rgba(0,0,0,.26)'
                        :
                        (this.props.secondary ? '#D75F77' : 'rgba(255,255,255,0.87)')
                    ),
                    fontFamily: "EuphemiaUCAS-Bold",
                    fontSize: 13,
                    fontWeight: 'bold',
                    lineHeight: 16,
                }}>{ this.props.text }</Text>
            </TouchableOpacity>
        );
    }
}