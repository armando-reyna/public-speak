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

import * as Actions from './class-review.actions';

class ClassReview extends Component {
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
                form: this.props.navigation.getParam('form')
            });
        })
    }
    componentWillUnmount() {
        this.props.reset();
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
    render() {
        return (
            <View style={styles.container}>
                {   (this.props.data) && (
                        <View style={styles.subContainer}>
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
                                    this.loader.reset();
                                })
                            }}
                            successText={ this.props.form.isCancelled ? 'Clase cancelada exitosamente.' : 'Clase finalizada exitosamente.' }
                            successButtonText='IR A MIS CLASES'
                            successButton={() => {
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
            loading: state.classReview.loading,
            error: state.classReview.error,
            data: state.classReview.data,
            reasonsForAbsence: state.classReview.reasonsForAbsence,
            form: state.classReview.form,
            absentStudents: state.classReview.absentStudents,
            currentStudent: state.classReview.currentStudent,
            showReasons: state.classReview.showReasons,
            skipEvaluation: state.classReview.skipEvaluation
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(ClassReview);