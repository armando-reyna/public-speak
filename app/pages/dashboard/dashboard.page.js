import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Platform,
  Image,
  Text,
  FlatList,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';

import openMap from 'react-native-open-maps';

import LoaderScreen from '../../components/loader-screen';
import Button from '../../components/button';
import CircleGraph from '../../components/circle-graph';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './dashboard.actions';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sun: new Animated.Value(0),
            cloud: new Animated.Value(0)
        }
        this.map = openMap;
    }
    update() {
        this.props.reset();
        this.props.getClasses().then(() => {
            if(this.props.error)
                this.loader.error();
        });
        this.animate();
    }
    componentDidMount() {
        this.update();
        DeviceEventEmitter.addListener('updateClassData', () => {
            this.update();
        });
    }
    animateSun() {
        Animated.sequence([
            Animated.timing(this.state.sun, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(this.state.sun, {
                toValue: 0,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(this.state.sun, {
                toValue: 2,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(this.state.sun, {
                toValue: 3,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true
            }),
        ]).start(() => {
            // this.animateSun();
        });
    }
    animateClouds() {
        Animated.sequence([
            Animated.timing(this.state.cloud, {
                toValue: 0,
                duration: 0,
                easing: Easing.linear
            }),
            Animated.timing(this.state.cloud, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear
            }),
            Animated.timing(this.state.cloud, {
                toValue: 2,
                duration: 0,
                easing: Easing.linear
            }),
            Animated.timing(this.state.cloud, {
                toValue: 3,
                duration: 10000,
                easing: Easing.linear
            })
        ]).start(() => {
            // this.animateClouds();
        });
    }
    animate() {
        // this.animateSun();
        this.animateClouds();
    }
    todayList(item, index) {
        return (
            <View>
                <View
                    style={{
                        padding: 20,
                        paddingBottom: 0
                    }}
                >
                    <View>
                        <Text style={{
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: "EuphemiaUCAS-Bold",
                            fontSize: 20,
                            fontWeight: 'bold',
                            lineHeight: 32
                        }}>Clases de hoy</Text>
                    </View>
                    <Text style={{
                        color: 'rgba(0,0,0,0.87)',
                        fontFamily: "EuphemiaUCAS",
                        fontSize: 14,
                        lineHeight: 24,
                        marginTop: 5,
                        marginBottom: 15
                    }}>Estas son tus próximas clases del día.</Text>
                </View>
                <FlatList
                    style={{
                        paddingBottom: 20
                    }}
                    data={item.classes}
                    horizontal={true}
                    renderItem={({item, index}) => {
                        return (
                            <View style={[
                                styles.classContainer,
                                {
                                    width: (Dimensions.get('screen').width * .85) - 10,
                                    marginLeft: !index ? 20 : null,
                                    marginRight: index === this.props.data[0].classes.length - 1 ? 20 : null,
                                    padding: 0,
                                    paddingTop: 20,
                                }
                            ]}>
                                <TouchableOpacity style={{ paddingLeft: 20, paddingRight: 20 }} onPress={() => { this.goToClassDetails(item) }}>
                                    <View style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 0
                                    }}>
                                        <CircleGraph porcentage={ ((item.currentClass * 100) / item.totalClassesOfLevel) } level={ item.level }></CircleGraph>
                                    </View>
                                    <Text style={[styles.title, {
                                        color: 'rgba(0,0,0,0.87)',
                                        fontFamily: 'EuphemiaUCAS-Bold',
                                        fontSize: 24,
                                        lineHeight: 32,
                                        fontWeight: 'bold'
                                    }]}>{item.clientName}</Text>
                                    <Text style={[styles.subTitle, {
                                        color: 'rgba(0,0,0,0.87)',
                                        fontFamily: 'EuphemiaUCAS-Bold',
                                        fontSize: 14,
                                        lineHeight: 14,
                                        fontWeight: 'bold'
                                    }]}>{item.classGroup}</Text>
                                    <Text style={[styles.subTitle, {    
                                        color: 'rgba(0,0,0,0.54)',
                                        fontFamily: 'EuphemiaUCAS',
                                        fontSize: 14,
                                        lineHeight: 20,
                                        marginBottom: 20
                                    }]}>{item.language}</Text>
                                    <View style={styles.info}>
                                        <Icon style={{
                                            marginRight: 5,
                                            color: 'rgba(0,0,0,0.38)'
                                        }} size={20} name='access-time'/>
                                        <Text style={{
                                            color: 'rgba(0,0,0,0.87)',
                                            fontFamily: "EuphemiaUCAS",
                                            fontSize: 14,
                                            lineHeight: 20,
                                        }}>{item.scheduleStartTime} - {item.scheduleEndTime}</Text>
                                    </View>
                                    {!item.address ? null :
                                        <TouchableOpacity
                                            onPress={() => {
                                                let settings
                                                if (item['latitude'] && item['longitude']) {
                                                    settings = { latitude: item['latitude'], longitude: item['longitude'] };
                                                } else {
                                                    settings = { query: item['address'] };
                                                }
                                                this.map(settings);
                                            }}
                                            style={styles.info}
                                        >
                                            <Icon style={{
                                                marginRight: 5,
                                                color: 'rgba(0,0,0,0.38)'
                                            }} size={20} name='location-on'/>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.87)',
                                                fontFamily: "EuphemiaUCAS",
                                                fontSize: 14,
                                                lineHeight: 20,
                                                textDecorationLine: 'underline'
                                            }}>{item.address}</Text>
                                        </TouchableOpacity>
                                    }
                                    <View style={[styles.borderBottom, {
                                        left: 0,
                                        right: 0,
                                    }]}/>
                                </TouchableOpacity>
                                { !item.isCancelled && !item.isFinished && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 10,
                                            paddingBottom: 5,
                                            paddingLeft: 20,
                                            paddingRight: 20
                                        }}
                                    >
                                        {
                                            !item.checkInAtPlace && ( <Button
                                                style={{
                                                    marginTop: 15
                                                }}
                                                disabled={true}
                                                lat={(this.props.teacherBusy || this.props.classInProgress) ? null : item.latitude}
                                                lon={(this.props.teacherBusy || this.props.classInProgress) ? null : item.longidude}
                                                enabledAt={(this.props.teacherBusy || this.props.classInProgress) ? null : item.checkinEnabledAt}
                                                disabledAt={(this.props.teacherBusy || this.props.classInProgress) ? null : item.checkinDisabledAt}
                                                showAtDisabled={true}
                                                onPress={() => {
                                                    this.goToClassInProgress(item);
                                                }}
                                                text="HE LLEGADO"
                                            /> )
                                        }
                                        {
                                            item.checkInAtPlace && !this.props.classInProgress && ( <Button
                                                style={{
                                                    marginTop: 15
                                                }}
                                                disabled={true}
                                                lat={item.latitude}
                                                lon={item.longidude}
                                                enabledAt={item.classEnabledAt}
                                                disabledAt={item.classDisabledAt}
                                                showAtDisabled={true}
                                                onPress={() => {
                                                    this.goToClassInProgress(item);
                                                }}
                                                text="COMENZAR CLASE"
                                            /> )
                                        }
                                        {
                                            item.checkInAtPlace && this.props.classInProgress && ( <Button
                                                style={{
                                                    marginTop: 15,
                                                    width: '100%'
                                                }}
                                                onPress={() => {
                                                    this.goToClassInProgress(item);
                                                }}
                                                text="IR A CLASE EN CURSO"
                                            /> )
                                        }
                                        {
                                            (!this.props.classInProgress || (this.props.classInProgress && this.props.classInProgress.id !== item.id)) && (
                                                <Button
                                                    secondary={true}
                                                    onPress={() => {
                                                        this.props.navigation.navigate('ClassFinishProcess', {
                                                            class: item
                                                        });
                                                    }}
                                                    style={{
                                                        marginTop: 15
                                                    }}
                                                    text="CANCELAR"
                                                />
                                            )
                                        }
                                    </View>
                                )}
                                { (item.isCancelled || item.isFinished) && (
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
                                        }}>{ item.isCancelled ? 'CLASE CANCELADA' : 'CLASE FINALIZADA' }</Text>
                                    </View>
                                )}
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => `${index}` }
                    ItemSeparatorComponent={() => <View style={{margin: 5}}/>}
                />
            </View>
        )
    }
    freeDay(item, index) {
        return (
            <View style={{
                margin: 20,
                backgroundColor: 'rgba(0,0,0,0.12)',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                <Animated.View style={{
                    width: '15%',
                    position: 'absolute',
                    top: 0,
                    marginTop: '-18%',
                    right: 10,
                    transform: [{
                        rotate: this.state.sun.interpolate({
                            inputRange: [0, 1, 2, 3],
                            outputRange: ['0deg', '20deg', '-20deg', '0deg']
                        })
                    }]
                }}>
                    <Image style={{
                        width: '100%'
                    }} source={require('../../assets/sun.png')} resizeMode="contain" />
                </Animated.View>
                <Animated.View style={{
                    width: '20%',
                    position: 'absolute',
                    top: 0,
                    marginLeft: 10,
                    opacity: this.state.cloud.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: [1, 0, 0, 1]
                    }),
                    left: this.state.cloud.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: ['0%', '10%', '-2%', '0%']
                    })
                }}>
                    <Image style={{
                        width: '100%'
                    }} source={require('../../assets/cloud.png')} resizeMode="contain" />
                </Animated.View>
                <Animated.View style={{
                    width: '20%',
                    position: 'absolute',
                    top: '40%',
                    opacity: this.state.cloud.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: [1, 0, 0, 1]
                    }),
                    left: this.state.cloud.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: ['50%', '60%', '48%', '50%']
                    })
                }}>
                    <Image style={{
                        width: '100%'
                    }} source={require('../../assets/cloud.png')} resizeMode="contain" />
                </Animated.View>
                <Text style={{
                    color: 'rgba(0,0,0,0.38)',
                        fontFamily: "EuphemiaUCAS-Bold",
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 22,
                        marginTop: 50,
                }}>No tienes clases hoy</Text>
                <Text style={{
                    color: 'rgba(0,0,0,0.38)',
                        fontFamily: "EuphemiaUCAS",
                        fontSize: 14,
                        lineHeight: 19,
                        marginBottom: 50,
                }}>Aprovecha para leer un libro o ver tu serie favorita.</Text>
            </View>
        );
    }
    refresh() {
        this.props.getClasses();
    }
    goToClassDetails(item) {
        this.props.navigation.navigate('ClassDetail', {
            class: item,
            transition: 'horizontal',
            teacherBusy: this.props.teacherBusy,
            classInProgress: this.props.classInProgress
        });
    }
    goToClassInProgress(item) {
        this.props.navigation.navigate('ClassInProgress', {
            transition: 'horizontal',
            class: item
        });
    }
    render() {
        return (
            <ScrollView
                style={styles.container}
                refreshControl={
                    (
                        Platform.OS !== 'ios' && (!this.props.data || this.props.error) ? 
                            <LoaderScreen 
                                reference={loader => this.loader = loader}
                                errorText={this.props.error ? this.props.error.message : ''}
                                auto={{
                                    delay: 5000,
                                    error: () => {
                                        if (this.props.error.type === "unauthorized") {
                                            this.props.navigation.replace('Login');
                                        } else {
                                            this.loader.exit().then(() => {
                                                this.props.hideLoader();
                                            })
                                        }
                                    }
                                }}
                            />
                            :
                            <RefreshControl
                                refreshing={this.props.loading}
                                onRefresh={this.refresh.bind(this)}
                            />
                    )
                }
            >
                { this.props.data && (
                        <View>
                            <FlatList
                                data={this.props.data}
                                renderItem={({item, index}) => {
                                    if (item.today && item.classes.length)
                                        return this.todayList(item, index);
                                    else if(!index)
                                        return this.freeDay(item, index);
                                    return (
                                        <View style={{
                                            shadowColor: 'rgba(0,0,0,.1)',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 1,
                                            shadowRadius: 12,
                                        }}>
                                            <View style={{
                                                width: '100%',
                                                backgroundColor: '#FAFAFA',
                                                padding: 11,
                                                paddingLeft: 20,
                                                paddingRight: 20,
                                                flexDirection: 'row',
                                            }}>
                                                <Text style={{
                                                    color: 'rgba(0,0,0,0.38)',
                                                    fontFamily: "EuphemiaUCAS-Bold",
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    lineHeight: 17,
                                                }}>Clases del {item.dayName},</Text>
                                                <Text style={{
                                                    color: '#335267',
                                                    fontFamily: "EuphemiaUCAS-Bold",
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                    lineHeight: 17,
                                                }}> {item.date}</Text>
                                            </View>
                                            <FlatList
                                                data={item.classes}
                                                renderItem={({item, index}) => {
                                                    return (
                                                        <TouchableOpacity
                                                            style={[styles.classContainer, {
                                                                paddingLeft: 94
                                                            }]}
                                                            onPress={() => { this.goToClassDetails(item) }}
                                                        >
                                                            <View style={{
                                                                position: 'absolute',
                                                                left: 20,
                                                                top: '50%'
                                                            }}>
                                                                <CircleGraph porcentage={ (item.currentClass * 100 ) / item.totalClassesOfLevel } level={ item.level }></CircleGraph>
                                                            </View>
                                                            <Text style={[styles.title]}>{item.clientName}</Text>
                                                            <Text style={styles.subTitle}>{item.classGroup}</Text>
                                                            { item.isCancelled && (
                                                                <View style={{
                                                                    backgroundColor: '#F1C0CD',
                                                                    padding: 5,
                                                                    alignSelf: 'flex-start',
                                                                    marginTop: 5,

                                                                }}>
                                                                    <Text style={{
                                                                        color: '#C04C61',
                                                                        fontFamily: "EuphemiaUCAS-Bold",
                                                                        fontSize: 12,
                                                                        fontWeight: 'bold',
                                                                        lineHeight: 14,
                                                                        textAlign: 'center'
                                                                    }}>Clase cancelada</Text>
                                                                </View>
                                                            )}
                                                            <Text style={[styles.subTitle, { color: 'rgba(0,0,0,.54)',lineHeight: 30 } ]}>{item.language}</Text>
                                                            <Text style={[styles.subTitle, { color: '#335267'}]}>{item.scheduleDaysSpanish}</Text>
                                                            <Icon style={styles.arrow} name='keyboard-arrow-right'/>
                                                            <View style={styles.borderBottom}/>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                                keyExtractor={(item, index) => `${index}` }/>
                                        </View>
                                    )
                                }}
                                keyExtractor={(item, index) => `${index}` }
                            />
                        </View>
                    )
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    classContainer: {
        backgroundColor: 'white',
        padding: 20,
        width: Dimensions.get('screen').width,
    },
    title: {
        color: 'rgba(0,0,0,0.87)',
        fontFamily: "EuphemiaUCAS-Bold",
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 19
    },
    subTitle: {
        color: 'rgba(0,0,0,0.87)',
        fontFamily: "EuphemiaUCAS",
        fontSize: 12,
        lineHeight: 14
    },
    borderBottom : {
        width: '100%',
        height: 1,
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        margin: 'auto',
        backgroundColor: '#EEE',
    },
    arrow: {
        position: 'absolute',
        right: 20,
        top: '50%',
        marginTop: 12,
        fontSize: 25,
        color: 'rgba(0,0,0,0.54)'
    },
    info: {
        marginBottom: 20,
        flexDirection: 'row',
    }
});

export default connect(
    (state, props) => {
        return {
            loading: state.dashboard.loading,
            error: state.dashboard.error,
            data: state.dashboard.data,
            freeDay: state.dashboard.freeDay,
            classInProgress: state.dashboard.classInProgress,
            teacherBusy: state.dashboard.teacherBusy
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(Dashboard);