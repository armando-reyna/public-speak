import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './class-in-progress.actions';

import Icon from 'react-native-vector-icons/MaterialIcons'
import Checkbox from '../../components/checkbox';
import Button from '../../components/button';
import LoaderScreen from '../../components/loader-screen';

class ClassInProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            change: false
        }
    }
    componentDidMount() {
        let classParam = this.props.navigation.getParam('class');
        this.props.setClass(classParam).then(() => {
            if (this.props.data.checkInAtPlace) {
                this.startClass();
            } else {
                this.props.hasArrived(this.props.data).then(data => {
                    if(this.props.error)
                        this.loader.error();
                    else
                        this.loader.success();
                });
            }
        });
    }
    componentWillUnmount() {
        this.props.reset();
    }
    startClass() {
        let promise = this.props.startClass(this.props.data);
        if (promise) {
            promise.then(() => {
                if(this.props.error)
                    this.loader.error();
                else
                    this.loader.success();
            });
        }
    }
    ToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
          seconds = parseInt((duration / 1000) % 60),
          minutes = parseInt((duration / (1000 * 60)) % 60),
          hours = parseInt((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
      
        return hours + ":" + minutes + ":" + seconds;
    }
    render() {
        let styleContainer = this.props.started ? {
            flex: 1,
            backgroundColor: '#F5F5F5',
        } : {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            flex: 1
        };
        return (
            <View style={styleContainer}>
                { !this.props.started &&
                    <LoaderScreen
                        reference={loader => this.loader = loader}
                        errorText={this.props.error ? this.props.error.message : ''}
                        errorButtonText="REINTENTAR"
                        errorButton={() => {
                            this.props.navigation.pop();
                        }}
                        successText="¡Perfecto! Llegaste a la ubicación de tu clase."
                        successButtonText="COMENZAR CLASE"
                        successButton={() => {
                            this.loader.reset();
                            this.startClass();
                        }}
                    />
                }
                {
                    this.props.started &&
                    <View style={{
                        flex: 1
                    }}>
                        <View style={styles.header}>
                            <Text style={[styles.text, {
                                fontSize: 40,
                                lineHeight: 42
                            }]}>{ this.ToTime(this.props.time) }</Text>
                            <Text style={[styles.text, {
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: 14,
                                    fontFamily: "EuphemiaUCAS-Bold",
                                    fontWeight: 'bold',
                                    lineHeight: 20
                            }]}>Tiempo de clase</Text>
                        </View>
                        <View style={{
                            backgroundColor: '#D75F77',
                            height: 4,
                            width: (this.props.time * 100) / this.props.data.duration + '%'
                        }}></View>
                        <View style={[styles.rowContainer, {
                            paddingBottom: 0
                        }]}>
                            <View style={styles.row}>
                                <Icon style={[{
                                    color: 'rgba(0,0,0,.54)'
                                }, styles.icon]} size={20} name='people'/>                                        
                                <Text style={styles.description}>Lista de asistencia - { this.props.data['students'].length } { this.props.data['students'].length === 1 ? 'alumno' : 'alumnos'}</Text>
                            </View>
                        </View>
                        <ScrollView
                            style={[styles.rowContainer, {
                                paddingTop: 0
                            }]}
                        >
                            <FlatList
                                extraData={this.state}
                                data={this.props.data['students']}
                                renderItem={({item, index}) => {
                                    return (
                                        <View style={{
                                            marginBottom: (index === this.props.data['students'].length - 1) ? 100 : 25,
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                        }}>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                            }}>
                                                <View style={[styles.circle, {
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: '#809DB3',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }]}>
                                                    <Text style={{
                                                        color: 'rgba(255,255,255,0.87)',
                                                        fontFamily: "EuphemiaUCAS-Bold",
                                                        fontSize: 13,
                                                        fontWeight: 'bold',
                                                        lineHeight: 13,
                                                        textAlign: 'center'
                                                    }}>{item['initials']}</Text>
                                                </View>
                                                <Text style={[styles.name]}>{item['name']}</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                            }}>
                                                { item.assistance && (
                                                    <Text style={{
                                                        color: '#D75F77',
                                                        fontFamily: "EuphemiaUCAS",
                                                        fontSize: 10,
                                                        lineHeight: 20,
                                                        marginRight: 10
                                                    }}>{ item.assistance.time }</Text>
                                                )}
                                                <Checkbox checked={item.assistance ? true : false} onPress={state => {
                                                    this.setState(s => {
                                                        s['change'] = !s['change'];
                                                        return s;
                                                    })
                                                    this.props.assistance(index, state);
                                                }}/>
                                            </View>
                                        </View>
                                    )
                                }}
                                keyExtractor={(item, index) => `${index}` }
                            />
                        </ScrollView>
                        <Button
                            style={{
                                position: 'absolute',
                                bottom: 30,
                                width: '90%',
                                marginLeft: '5%',
                                shadowOpacity: .42,
                                shadowOffset: {
                                    height: 2,
                                },
                                shadowColor : '#000000',
                                shadowRadius: 30,
                                elevation: 1,
                            }}
                            onPress={() => {
                                if (this.props.validFinish)
                                    this.props.navigation.replace('ClassStudentConfirmation', {
                                        class: { ...this.props.data, classTime: this.props.time }
                                    });
                                else
                                    this.props.navigation.replace('ClassFinishProcess', {
                                        class: { ...this.props.data, classTime: this.props.time }
                                    });
                            }}
                            text="FINALIZAR CLASE"
                        />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgba(51, 82, 103, 1)',
        padding: 20,
        paddingTop: 20,
        height: 'auto'
    },
    text: {
        color: '#FFFFFF',
        fontFamily: "EuphemiaUCAS",
        fontSize: 24,
        lineHeight: 32,        
    },
    rowContainer: {
        padding: 20
    },
    circle: {
        borderRadius: 50,
        width: 10,
        height: 10,
        marginRight: 10,
        marginTop: 6
    },
    row: {
        flexDirection: 'row',
    },
    icon: {
        marginRight: 15,
        marginLeft: 5,
        color: 'rgba(0,0,0,0.38)'
    },
    description: {
        color: 'rgba(0,0,0,0.87)',
        fontFamily: "EuphemiaUCAS",
        fontSize: 14,
        lineHeight: 19,
        paddingRight: 20,
        marginBottom: 15
    },
    name: {
        color: 'rgba(0,0,0,0.87)',
        fontFamily: "EuphemiaUCAS",
        fontSize: 14,
        lineHeight: 19
    }
});

export default connect(
    (state, props) => {
        return {
            error: state.classInProgress.error,
            data: state.classInProgress.data,
            started: state.classInProgress.started,
            time: state.classInProgress.time,
            validFinish: state.classInProgress.validFinish
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(ClassInProgress);