import React, { Component } from 'react';
import {
  StyleSheet,
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

import * as Actions from './class-student-confirmation.actions';

class ClassStudentConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            change: false
        }
    }
    componentDidMount() {
        this.props.getTypes().then(() => {
            this.props.setClass({
                class: this.props.navigation.getParam('class'),
                form: this.props.navigation.getParam('form'),
                skipEvaluation: this.props.navigation.getParam('skipEvaluation')
            }).then(() => {
                if (!this.props.absentStudents.length) {
                    this.finish();
                }
            });
            this.radioNo.toggle();
        })
    }
    componentWillUnmount() {
        this.props.reset();
    }
    continue() {
        this.props.continueFinish();
    }
    finish() {
        this.props.finish(this.props.data.id, this.props.form).then(() => {
            if (this.props.error)
                this.loader.error();
            else
                this.loader.success();
        });
    }
    validateForm() {
        setTimeout(() => {
            if (this.props.form.valid)
                this.confirmButton.enable();
            else
                this.confirmButton.disable();
        }, 1000)
    }
    updateFlatList() {
        this.setState(state => {
            state['change'] = !state['change'];
            return state;
        })
    }
    updateStudent(index, state, reason) {
        this.props.updateStudent(index, state, reason);
        this.validateForm();
        this.updateFlatList();
    }
    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.data && this.props.absentStudents[this.props.currentStudent] && (
                        <View style={styles.subContainer}>
                            <Text style={[styles.title, {
                                marginTop: 20,
                                marginBottom: 20
                            }]}>Alumnos que no asistieron.</Text>
                            <Text style={[styles.subText, {
                                marginBottom: 40
                            }]}>Los siguientes alumnos figuran como ausentes en la clase de hoy. Selecciona el motivo de inasistencia en caso de existir.</Text>
                            <View style={[styles.card, {
                                marginBottom: 40
                            }]}>
                                <Text style={{
                                    color: '#D75F77',
                                    fontFamily: "Euphemia UCAS",
                                	fontSize: 12,
                                	lineHeight: 16,
                                    textAlign: 'center',
                                    marginBottom: 10
                                }}>Alumno { this.props.currentStudent + 1 }/{ this.props.absentStudents.length }</Text>
                                <Text style={[styles.title, {
                                    color: 'rgba(0,0,0,0.87)',
                                    fontFamily: 'EuphemiaUCAS-Bold',
                                    fontSize: 16,
                                    lineHeight: 19,
                                    fontWeight: 'bold',
                                    textAlign: 'left'
                                }]}>{ this.props.absentStudents[this.props.currentStudent].name }</Text>
                                <Radio style={{
                                    marginTop: 25
                                }} reference={radioYes => this.radioYes = radioYes} labelStyle={{
                                    color: 'rgba(0,0,0,0.87)',
                                    fontFamily: "EuphemiaUCAS",
                                    fontWeight: 'normal',
                                	fontSize: 14,
                                	lineHeight: 20,
                                }} disabledColor="rgba(0,0,0,0.87)" index={0} label='Sí asistió' name='studentConfirmation'
                                    onPress={(state) => {
                                        this.updateStudent(
                                            this.props.absentStudents[this.props.currentStudent].index,
                                            true
                                        )
                                    }}
                                />
                                <Radio style={{
                                    marginTop: 20
                                }} reference={radioNo => this.radioNo = radioNo} labelStyle={{
                                    color: 'rgba(0,0,0,0.87)',
                                    fontFamily: "EuphemiaUCAS",
                                    fontWeight: 'normal',
                                	fontSize: 14,
                                	lineHeight: 20,
                                }} disabledColor="rgba(0,0,0,0.87)" index={1} label='No asistió' name='studentConfirmation'
                                    onPress={(state) => {
                                        this.updateStudent(
                                            this.props.absentStudents[this.props.currentStudent].index,
                                            false
                                        )
                                    }}
                                />
                                { this.props.showReasons && (
                                    <FlatList
                                        data={this.props.reasonsForAbsence}
                                        extraData={ this.state }
                                        numColumns={2}
                                        renderItem={({item, index}) => {
                                            return (
                                                <TouchableOpacity onPress={() => {
                                                    this.updateStudent(
                                                        this.props.absentStudents[this.props.currentStudent].index,
                                                        false,
                                                        item.id
                                                    )
                                                }}>
                                                    <Text style={this.props.form.attendance[this.props.absentStudents[this.props.currentStudent].index].reasonForAbsence === item.id ? styles.tagActive : styles.tag }>{ item.description }</Text>
                                                </TouchableOpacity>
                                            );
                                        }}
                                        keyExtractor={(item, index) => `${index}` }
                                    />
                                )}
                            </View>
                            <Button
                                style={{
                                    width: '100%'
                                }}
                                disabled={!this.props.form.valid}
                                showAtDisabled={true}
                                reference={button => this.confirmButton = button}
                                text={ this.props.currentStudent === this.props.absentStudents.length - 1 ? (this.props.skipEvaluation ? 'FINALIZAR': 'CONTINUAR') : 'SIGUIENTE ALUMNO' }
                                onPress={() => {
                                    if (this.props.currentStudent === this.props.absentStudents.length - 1) {
                                        if (this.props.skipEvaluation) {
                                            this.finish();
                                        } else {
                                            this.props.next(); 
                                        }
                                    } else {
                                        this.props.form.attendance[this.props.absentStudents[this.props.currentStudent].index].isPresent ? this.radioYes.toggle() : this.radioNo.toggle();
                                        this.props.next();
                                        this.radioNo.toggle();
                                    }
                                }}
                            />
                        </View>
                    )
                }
                { this.props.data && !this.props.skipEvaluation && !this.props.absentStudents[this.props.currentStudent] && (
                        <View style={styles.subContainer}>
                            <Text style={{
                                color: '#FFFFFF',
                                fontFamily: "EuphemiaUCAS-Bold",
                                fontSize: 16,
                                fontWeight: 'bold',
                                lineHeight: 20,
                                textAlign: 'center',
                                marginBottom: 40
                            }}>Para obtener retroalimentación por favor presta tu dispositivo al alumno:</Text>
                            <Text style={{
                                color: '#FFFFFF',
                                fontFamily: "EuphemiaUCAS-Bold",
                                fontSize: 24,
                                fontWeight: 'bold',
                                lineHeight: 28,
                                textAlign: 'center',
                                marginBottom: 70
                            }}>{ this.props.form.attendance[0].name }</Text>
                            <Button 
                                style={{
                                    width: '100%'
                                }}
                                text={ 'SOY ' + this.props.form.attendance[0].name.toUpperCase() }
                                onPress={() => {
                                    this.props.navigation.replace('ClassReview', {
                                        class: this.props.data,
                                        form: this.props.form
                                    })
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
                                    this.loader.reset();
                                    this.finish();
                                })
                            }}
                            successText={ 'Clase finalizada exitosamente.' }
                            successButtonText={ this.props.skipEvaluation ? 'IR A MIS CLASES' : 'CONTINUAR' }
                            successButton={() => {
                                if (this.props.skipEvaluation) {
                                    this.props.navigation.navigate('Dashboard')
                                } else {
                                    this.loader.exit().then(() => {
                                        this.props.hideLoader();
                                        this.loader.reset();
                                    })
                                }
                            }}
                        />
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tag: {
        borderWidth: 2,
        borderRadius: 3,
        fontFamily: 'EuphemiaUCAS',
        fontSize: 14,
        lineHeight: 19,
        padding: 10,
        marginTop: 20,
        marginRight: 10,
        textAlign: 'center',
        width: (Dimensions.get('screen').width / 2) - 60,
        borderColor: 'rgba(0,0,0,0.38)',
        color: 'rgba(0,0,0,0.38)'
    },
    tagActive: {
        borderWidth: 2,
        borderRadius: 3,
        fontFamily: 'EuphemiaUCAS',
        fontSize: 14,
        lineHeight: 19,
        padding: 10,
        marginTop: 20,
        marginRight: 10,
        textAlign: 'center',
        width: (Dimensions.get('screen').width / 2) - 60,
        color: 'white',
        borderColor: '#D75F77',
        backgroundColor: '#D75F77'
    },
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
            loading: state.classStudentConfirmation.loading,
            error: state.classStudentConfirmation.error,
            data: state.classStudentConfirmation.data,
            reasonsForAbsence: state.classStudentConfirmation.reasonsForAbsence,
            form: state.classStudentConfirmation.form,
            absentStudents: state.classStudentConfirmation.absentStudents,
            currentStudent: state.classStudentConfirmation.currentStudent,
            showReasons: state.classStudentConfirmation.showReasons,
            skipEvaluation: state.classStudentConfirmation.skipEvaluation
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(ClassStudentConfirmation);