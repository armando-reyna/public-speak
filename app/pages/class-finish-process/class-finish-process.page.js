import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Button from '../../components/button';
import Radio from '../../components/radio';
import LoaderScreen from '../../components/loader-screen';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CircleGraph from '../../components/circle-graph';

import * as Actions from './class-finish-process.actions';

class ClassFinishProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            change: false
        }
    }
    componentDidMount() {
        this.props.getTypes().then(() => {
            this.props.setClass(this.props.navigation.getParam('class'));
        })
    }
    componentWillUnmount() {
        this.props.reset();
    }
    continue() {
        this.props.continueFinish();
    }
    finish() {
        this.props.finish(this.props.data.id, this.props.form, this.props.data.needConfirmation ? false : true).then(() => {
            if (this.props.error)
                this.loader.error();
            else
                this.loader.success();
        });
    }
    validateForm() {
        this.setState(state => {
            state['change'] = !state['change'];
            return state;
        })
        setTimeout(() => {
            if (this.props.form.valid)
                this.cancelButton.enable();
            else
                this.cancelButton.disable();
        }, 1000)
    }
    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.data && !this.props.confirmed && (
                        <View style={styles.subContainer}>
                            <Icon style={styles.icon} name='warning'/>
                            <Text style={[styles.title, {
                                marginTop: 20,
                                marginBottom: 20
                            }]}>{ this.props.form.isCancelled ? 'Cancelar clase' : 'Finalizar clase antes de tiempo' }</Text>
                            <Text style={[styles.subText, {
                                marginBottom: 40
                            }]}>{ this.props.form.isCancelled ? 'Asegúrate que esta sea la clase que deseas cancelar.' : 'Estas a punto de finalizar tu clase antes del tiempo reglamentado. Si lo haces, se notificará al equipo de S-Peak.' }</Text>
                            {
                                this.props.form.isCancelled && (
                                    <View style={[styles.card, {
                                        marginBottom: 40
                                    }]}>
                                        <View style={{
                                            position: 'absolute',
                                            right: 20,
                                            top: 20
                                        }}>
                                            <CircleGraph porcentage={ ((this.props.data.currentClass * 100) / this.props.data.totalClassesOfLevel) } level={ this.props.data.level }></CircleGraph>
                                        </View>
                                        <Text style={[styles.title, {
                                            color: 'rgba(0,0,0,0.87)',
                                            fontFamily: 'EuphemiaUCAS-Bold',
                                            fontSize: 24,
                                            lineHeight: 32,
                                            fontWeight: 'bold',
                                            textAlign: 'left'
                                        }]}>{this.props.data.clientName}</Text>
                                        <Text style={[styles.subTitle, {
                                            color: 'rgba(0,0,0,0.87)',
                                            fontFamily: 'EuphemiaUCAS-Bold',
                                            fontSize: 14,
                                            lineHeight: 14,
                                            fontWeight: 'bold'
                                        }]}>{this.props.data.classGroup}</Text>
                                        <Text style={[styles.subTitle, {    
                                            color: 'rgba(0,0,0,0.54)',
                                            fontFamily: 'EuphemiaUCAS',
                                            fontSize: 14,
                                            lineHeight: 20,
                                            marginBottom: 20
                                        }]}>{this.props.data.language}</Text>
                                        <View style={styles.info}>
                                            <Icon style={{
                                                marginRight: 5,
                                                color: 'rgba(0,0,0,0.38)'
                                            }} size={20} name='event'/>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.87)',
                                                fontFamily: 'EuphemiaUCAS',
                                                fontSize: 14,
                                                lineHeight: 20,
                                            }}>{this.props.data.date}</Text>
                                        </View>
                                        <View style={styles.info}>
                                            <Icon style={{
                                                marginRight: 5,
                                                color: 'rgba(0,0,0,0.38)'
                                            }} size={20} name='access-time'/>
                                            <Text style={{
                                                color: 'rgba(0,0,0,0.87)',
                                                fontFamily: 'EuphemiaUCAS',
                                                fontSize: 14,
                                                lineHeight: 20,
                                            }}>{this.props.data.scheduleStartTime} - {this.props.data.scheduleEndTime}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            <Button
                                style={{
                                    width: '100%'
                                }}
                                text={ this.props.form.isCancelled ? 'CONTINUAR CANCELACIÓN' : 'SIGUIENTE' }
                                onPress={() => {
                                    this.continue();
                                }}
                            />
                            <Button
                                secondary={true}
                                text='REGRESAR'
                                onPress={() => {
                                    this.props.navigation.pop();
                                }}
                            />
                        </View>
                    )
                }
                {
                    this.props.confirmed && !this.props.error && !this.props.loading && (
                        <View style={styles.subContainer}>
                            <Text style={[styles.title, {
                                marginTop: 10,
                                marginBottom: 20
                            }]}>{ this.props.form.isCancelled ? '¿Qué tipo de cancelación es?' : '¿Por qué finalizas la clase antes de tiempo?'}</Text>
                            <ScrollView>
                                <FlatList
                                    extraData={this.state}
                                    data={ this.props.form.isCancelled ? this.props.cancellationTypes : this.props.finishTypes }
                                    renderItem={({item, index}) => {
                                        return (
                                            <View style={{
                                                marginBottom: (index === (this.props.form.isCancelled ? this.props.cancellationTypes : this.props.finishTypes).length - 1) ? 80 : 20,
                                                paddingRight: 35
                                            }}>
                                                <Radio index={index} label={item.description} name='cancellationType' onPress={(state) => {
                                                    if (state) {
                                                        this.props.updateProperty('cancellationTypeID', item.id);
                                                        this.validateForm();
                                                    }
                                                }}/>
                                                { this.props.form.cancellationTypeID === item.id && item.showReasons && (
                                                    <View style={{
                                                        paddingLeft: 35,
                                                        paddingTop: 20
                                                    }}>
                                                        <Text style={{
                                                            color: 'rgba(255,255,255,0.7)',
                                                            fontFamily: 'EuphemiaUCAS-Bold',
                                                            fontSize: 13,
                                                            fontWeight: 'bold',
                                                            lineHeight: 16,
                                                        }}>Elige el motivo</Text>
                                                        <FlatList
                                                            data={this.props.reasonsForAbsence}
                                                            extraData={this.state}
                                                            numColumns={2}
                                                            renderItem={({item, index}) => {
                                                                return (
                                                                    <TouchableOpacity onPress={() => {
                                                                        this.props.updateProperty('reasonIDForCancellation', item.id);
                                                                        this.validateForm();
                                                                    }}>
                                                                        <Text style={[{
                                                                            borderWidth: 2,
                                                                            borderRadius: 3,
                                                                            color: '#FFFFFF',
                                                                            fontFamily: 'EuphemiaUCAS',
                                                                            fontSize: 14,
                                                                            lineHeight: 19,
                                                                            padding: 10,
                                                                            marginTop: 20,
                                                                            marginRight: 10,
                                                                            textAlign: 'center',
                                                                            width: (Dimensions.get('screen').width / 2) - 60
                                                                        }, this.props.form.reasonIDForCancellation === item.id ? {
                                                                            borderColor: '#D75F77',
                                                                            backgroundColor: '#D75F77'
                                                                        } : {
                                                                            borderColor: 'white',
                                                                            backgroundColor: 'rgba(255,255,255,0.12)',
                                                                        } ]}>{ item.description }</Text>
                                                                    </TouchableOpacity>
                                                                );
                                                            }}
                                                            keyExtractor={(item, index) => `${index}` }
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => `${index}` }
                                />
                            </ScrollView>
                            <Button style={styles.fixedButton}
                                reference={button => {
                                    this.cancelButton = button;
                                }}
                                disabled={!this.props.form.valid}
                                showAtDisabled={true}
                                text={  this.props.form.isCancelled ? 'CANCELAR CLASE' : 'FINALIZAR CLASE'}
                                onPress={() => {
                                    this.finish();
                                }}
                            />
                        </View>
                    )
                }
                {   (!this.props.data || this.props.error || this.props.loading) && (
                        <LoaderScreen 
                            reference={loader => this.loader = loader}
                            errorText={this.props.error ? this.props.error.message : ''}
                            errorButtonText='REINTENTAR'
                            errorButton={() => {
                                this.loader.exit().then(() => {
                                    this.props.hideLoader();
                                })
                            }}
                            successText={ this.props.form.isCancelled ? 'Clase cancelada exitosamente.' : 'Clase finalizada exitosamente.' }
                            successButtonText={ this.props.data && this.props.data.needConfirmation ? 'CONTINUAR' : 'IR A MIS CLASES' }
                            successButton={() => {
                                if (this.props.data.needConfirmation)
                                    this.props.navigation.replace('ClassStudentConfirmation', {
                                        class: this.props.data,
                                        form: this.props.form,
                                        skipEvaluation: true,
                                    })
                                else
                                    this.props.navigation.navigate('Dashboard')
                            }}
                        />
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(51, 82, 103, 1)',
    },
    subContainer: {
        flex: 1,
        backgroundColor: 'rgba(51, 82, 103, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20
    },
    icon: {
        fontSize: 40,
        color: '#FDF71C'
    },
    title: {
        fontFamily: 'EuphemiaUCAS-Bold',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
        textAlign: 'center',
        color: 'white',
    },
    subText: {
        fontFamily: 'EuphemiaUCAS-Bold',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        textAlign: 'center',
        color: 'white'
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        width: '100%',
    },
    subTitle: {
        color: 'rgba(0,0,0,0.87)',
        fontFamily: 'EuphemiaUCAS',
        fontSize: 12,
        lineHeight: 14
    },
    info: {
        marginBottom: 20,
        flexDirection: 'row',
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
    }
});

export default connect(
    (state, props) => {
        return {
            loading: state.classFinishProcess.loading,
            error: state.classFinishProcess.error,
            data: state.classFinishProcess.data,
            confirmed: state.classFinishProcess.confirmed,
            cancellationTypes: state.classFinishProcess.cancellationTypes,
            finishTypes: state.classFinishProcess.finishTypes,
            reasonsForAbsence: state.classFinishProcess.reasonsForAbsence,
            form: state.classFinishProcess.form,
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(ClassFinishProcess);