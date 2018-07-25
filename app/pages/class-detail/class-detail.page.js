import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';

import openMap from 'react-native-open-maps';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './class-detail.actions';

import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '../../components/button';
import CircleGraph from '../../components/circle-graph';

class ClassDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { }
        this.map = openMap;
    }
    update() {
        this.props.getClass(this.props.navigation.getParam('class').id);
    }
    componentDidMount() {
        this.update();
        DeviceEventEmitter.addListener('updateClassData', () => {
            this.update();
        });
    }
    goToClassInProgress(item) {
        this.props.navigation.navigate('ClassInProgress', {
            transition: 'horizontal',
            class: item
        });
    }
    render() {
        let level = this.props.data ? this.props.data.level : null,
        color = '#D8D8D8';
        if (level) {
            switch (level.split('.')[0]) {
                case 'A1':
                    color = '#F39421';
                break;
                case 'A2':
                    color = '#E0761E';
                break;
                case 'B1':
                    color = '#5B9BD5';
                break;
                case 'B2':
                    color = '#3C6EC8';
                break;
                case 'C1':
                    color = '#92D050';
                break;
                case 'C2':
                    color = '#70AD47';
                break;
            }
        }
        return (!this.props.data ? null :
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.text}>{ this.props.data['clientName'] }</Text>
                    <Text style={[styles.text, {
                        fontSize: 16,
                        lineHeight: 20
                    }]}>{ this.props.data['classGroup'] }</Text>
                    <Text style={[styles.text, {
                        fontSize: 14,
                        lineHeight: 20,
                        color: 'rgba(255,255,255,0.7)'
                    }]}>{ this.props.data['language'] }</Text>
                </View>
                {
                    (!this.props.classInProgress || (this.props.classInProgress && this.props.classInProgress.id !== this.props.data.id)) && !this.props.data.isCancelled && !this.props.data.isFinished && (
                        <Button
                            style={styles.secondaryButton}
                            icon="event-busy"
                            text="CANCELAR CLASE"
                            secondary={true}
                            onPress={() => {
                                this.props.navigation.navigate('ClassFinishProcess', {
                                    class: this.props.data
                                });
                            }}
                        />
                    )
                }
                {
                    (this.props.data.isCancelled || this.props.data.isFinished) && (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: '#F1C0CD',
                                padding: 18,
                                alignContent: 'center'
                            }}
                        >
                            <Text style={{
                                color: '#C04C61',
                                fontFamily: "EuphemiaUCAS",
                                fontSize: 16,
                                fontWeight: 'bold',
                                lineHeight: 30,
                            }}>{ this.props.data.isCancelled ? 'CLASE CANCELADA' : 'CLASE FINALIZADA' }</Text>
                        </View>
                    )
                }
                <ScrollView>
                    <Text style={{
                        color: '#335267',
                        fontFamily: "EuphemiaUCAS-Bold",
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 20,
                        textAlign: 'center', 
                        marginBottom: 30,
                        marginTop: 30               
                    }}>Nivel: { this.props.data['levelName'] } | Subnivel: { this.props.data['level'] }</Text>
                    <View style={[styles.rowContainer, {
                        paddingTop: 0,
                        paddingLeft: 116
                    }]}>
                        <View style={{
                            position: 'absolute',
                            left: 20,
                            top: -10
                        }}>
                            <CircleGraph textStyle={{
                                fontSize: 20
                            }} size={80} porcentage={ ((this.props.data.currentClass * 100) / this.props.data.totalClassesOfLevel) } level={ this.props.data.level }></CircleGraph>
                        </View>
                        <Text style={{
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: "EuphemiaUCAS-Bold",
                            fontSize: 14,
                            fontWeight: 'bold',
                            lineHeight: 20,
                            marginBottom: 10
                        }}>Total de horas de subnivel: { this.props.data['totalClassesOfLevel'] }h</Text>
                        <View style={styles.row}>
                            <View style={[, styles.circle, {
                                backgroundColor: color
                            }]}></View>
                            <Text style={{
                                color: 'rgba(0,0,0,0.87)',
                                fontFamily: "EuphemiaUCAS",
                                fontSize: 12,
                                lineHeight: 20
                            }}>Horas cursadas: {this.props.data['currentClass']}h</Text>
                        </View>
                        <View style={styles.row}>
                            <View style={[, styles.circle, {
                                backgroundColor: '#D8D8D8'
                            }]}></View>
                            <Text style={{
                                color: 'rgba(0,0,0,0.87)',
                                fontFamily: "EuphemiaUCAS",
                                fontSize: 12,
                                lineHeight: 20
                            }}>Horas restantes: { this.props.data['totalClassesOfLevel'] > this.props.data['currentClass'] ? this.props.data['totalClassesOfLevel'] - this.props.data['currentClass'] : 0 }h</Text>
                        </View>
                    </View>
                    <View style={styles.separator}/>
                    <View style={styles.rowContainer}>
                        <View style={styles.row}>
                            <Icon style={styles.icon} size={20} name='event'/>
                            <Text style={styles.description}>{this.props.data['date']}</Text>
                        </View>
                        <View style={styles.row}>
                            <Icon style={styles.icon} size={20} name='access-time'/>                                        
                            <Text style={styles.description}>{this.props.data.scheduleStartTime} - {this.props.data.scheduleEndTime}</Text>
                        </View>
                        { !this.props.data['address'] ? null :
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => {
                                    let settings
                                    if (this.props.data['latitude'] && this.props.data['longitude']) {
                                        settings = { latitude: this.props.data['latitude'], longitude: this.props.data['longitude'] };
                                    } else {
                                        settings = { query: this.props.data['address'] };
                                    }
                                    this.map(settings);
                                }}
                            >
                                <Icon style={styles.icon} size={20} name='location-on'/>
                                <Text style={[styles.description, {
                                    textDecorationLine: 'underline'
                                }]}>{ this.props.data['address'] }</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.separator}/>
                    <View style={[styles.rowContainer, {
                        paddingBottom: 0
                    }]}>
                        <View style={styles.row}>
                            <Icon style={[{
                                color: 'rgba(0,0,0,.54)'
                            }, styles.icon]} size={20} name='people'/>                                        
                            <Text style={styles.description}>{ this.props.data['students'].length } { this.props.data['students'].length === 1 ? 'alumno inscrito' : 'alumnos inscritos'}</Text>
                        </View>
                    </View>
                    <FlatList
                        style={[styles.rowContainer, {
                            paddingTop: 0
                        }]}
                        data={this.props.data['students']}
                        renderItem={({item, index}) => {
                            return (
                                <View style={[styles.row, {
                                    marginBottom: (index === this.props.data['students'].length - 1) ? 80 : 25,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }]}>
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
                            )
                        }}
                        keyExtractor={(item, index) => `${index}` }
                    />
                </ScrollView>
                {
                    (!this.props.data.checkInAtPlace && !this.props.classInProgress && !this.props.teacherBusy && !this.props.data.isCancelled) && (
                        <Button
                            style={styles.fixedButton}
                            disabled={true}
                            lat={this.props.data.latitude}
                            lon={this.props.data.longidude}
                            enabledAt={this.props.data.checkinEnabledAt}
                            disabledAt={this.props.data.checkinDisabledAt}
                            onPress={() => {
                                this.goToClassInProgress(this.props.data);
                            }}
                            text="HE LLEGADO"
                        />
                    )
                }
                {
                    (this.props.data.checkInAtPlace && !this.props.classInProgress && !this.props.data.isCancelled && !this.props.data.isFinished) && (
                        <Button
                            style={styles.fixedButton}
                            disabled={true}
                            lat={this.props.data.latitude}
                            lon={this.props.data.longidude}
                            enabledAt={this.props.data.classEnabledAt}
                            disabledAt={this.props.data.classDisabledAt}
                            onPress={() => {
                                this.goToClassInProgress(this.props.data);
                            }}
                            text="COMENZAR CLASE"
                        />
                    )
                }
                {
                    (this.props.data.checkInAtPlace && this.props.classInProgress && this.props.classInProgress.id === this.props.data.id) && (
                        <Button
                            style={styles.fixedButton}
                            onPress={() => {
                                this.goToClassInProgress(this.props.data);
                            }}
                            text="IR A CLASE EN CURSO"
                        />
                    )
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: 'rgba(51, 82, 103, 1)',
        padding: 20,
        paddingTop: 0
    },
    text: {
        color: '#FFFFFF',
        fontFamily: "EuphemiaUCAS-Bold",
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,        
    },
    circle: {
        borderRadius: 50,
        width: 10,
        height: 10,
        marginRight: 10,
        marginTop: 6
    },
    rowContainer: {
        padding: 20
    },
    row: {
        flexDirection: 'row',
    },
    separator: {
        height: 1,
        backgroundColor: '#D8D8D8',
        width: '85%',
        marginLeft: '15%'
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
    },
    fixedButton: {
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
    },
    secondaryButton: {
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1,
        marginTop: 0,
        padding: 0,
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%'
    }
});

export default connect(
    (state, props) => {
        return {
            loading: state.classDetail.loading,
            error: state.classDetail.error,
            data: state.classDetail.data,
            teacherBusy: state.classDetail.teacherBusy,
            classInProgress: state.classDetail.classInProgress,
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(ClassDetail);