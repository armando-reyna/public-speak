import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import LoaderScreen from '../../components/loader-screen';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './change-password.actions';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wait: false
        }
    }
    submitCode() {
        if (this.props.form.valid) {
            this.props.verifyCode(this.props.form.verificationCode, this.props.navigation.getParam('email')).then((data) => {
                if(this.props.error)
                    this.loader.error();
                else {
                    this.loader.success();
                }
            });
        } else {
            this.verificationInput.focus();
        } 
    }
    submit() {
        this.validatePassword();
        if (this.props.form.valid) {
            // let url = this.props.navigation.getParam('url');
            // let token = url.split('token')[1].split('&')[0].replace('=', '');
            // let userID = url.split('userID')[1].split('&')[0].replace('=', '');
            this.props.changePassword(this.props.form.password, this.props.form.token).then((data) => {
                if(this.props.error)
                    this.loader.error();
                else {
                    this.loader.success();
                }
            });
        } else if (!this.props.form.password) {
            this.passwordInput.focus();
        } else if (!this.props.form.repeatPassword) {
            this.repeatPasswordInput.focus();
        }
        else {
            this.passwordInput.focus(false);
            this.repeatPasswordInput.focus(false);
        }
    }
    validatePassword() {
        if (this.props.form.valid) {
            this.repeatPasswordInput.error(false);
        } else if (this.props.form.repeatPassword) {
            this.repeatPasswordInput.error(true);
        }
    }
    render() {
        return (
            <View style={styles.mainContainer}>
                { !this.props.form.token &&
                    <View style={styles.container}>
                        <Text style={{
                            fontSize: 24,
                            marginBottom: 15,
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: "EuphemiaUCAS",
                            lineHeight: 32,
                            textAlign: 'center'
                        }}>Verifica tu identidad.</Text>
                        <Text style={{
                            fontSize: 14,
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: "EuphemiaUCAS",
                            lineHeight: 20,
                            marginBottom: 30,
                            textAlign: 'center'
                        }}>Por tu seguridad necesitamos comprobar tu identidad. Ingresa el código de 4 dígitos que hemos enviado a tu email.</Text>
                        <Input placeholder="Código de verificación" onChange={(value) => this.props.updateProperty('verificationCode', value)} ref={input => { this.verificationInput = input }}/>
                        <Button style={{
                            marginTop: 60,
                            width: '100%'
                        }} onPress={() => this.submitCode() } text="CONTINUAR"/>
                        <Button
                            onPress={() => {
                                this.props.navigation.navigate('PasswordRecovery', {
                                    email: this.props.navigation.getParam('email')
                                });
                            }}
                            secondary={true}
                            style={styles.secondaryButton}
                            text="Reenviar código"/>
                    </View>
                }
                { this.props.form.token &&
                    <View style={styles.container}>
                        <Text style={{
                            fontSize: 24,
                            marginBottom: 15,
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: "EuphemiaUCAS",
                            lineHeight: 32,
                            textAlign: 'center'
                        }}>Crea una nueva contraseña.</Text>
                        <Text style={{
                            fontSize: 14,
                            color: 'rgba(0,0,0,0.87)',
                            fontFamily: "EuphemiaUCAS",
                            lineHeight: 20,
                            marginBottom: 30,
                            textAlign: 'center'
                        }}>Con esta nueva contraseña iniciarás sesión de ahora en adelante.</Text>
                        <Input placeholder="Nueva contraseña" onChange={(value) => this.props.updateProperty('password', value)} password={true} returnKeyType={'next'} ref={input => { this.passwordInput = input }} next={() => { this.props.form.repeatPassword ? this.submit() : this.repeatPasswordInput.focus(); }}/>
                        <Input placeholder="Repite tu nueva contraseña" onChange={(value) => this.props.updateProperty('repeatPassword', value)} errorMessage="La contraseña ingresada no coincide." password={true} returnKeyType={'done'} ref={input => { this.repeatPasswordInput = input; }} next={() => { this.props.form.password ? this.submit() : this.passwordInput.focus(); }}/>
                        <Button style={{
                            marginTop: 60,
                            width: '100%'
                        }} onPress={() => this.submit() } text="CREAR CONTRASEÑA"/>
                        <Button
                            onPress={() => {
                                this.props.navigation.replace('Login', { transition: 'vertical', passwordChanged: true });
                            }}
                            secondary={true}
                            style={styles.secondaryButton}
                            text="CANCELAR"/>
                    </View>
                }
                { (this.props.loading || this.props.error || this.props.data) && 
                    <LoaderScreen 
                        reference={loader => this.loader = loader}
                        errorText={this.props.error ? this.props.error.message : ''}
                        errorButtonText="REINTENTAR"
                        errorButton={() => {
                            this.loader.exit().then(() => {
                                this.props.hideLoader();
                            })
                        }}
                        successText="Contraseña creada exitosamente."
                        successButtonText="INICIAR SESIÓN"
                        successButton={() => this.props.navigation.replace('Login')}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    secondaryButton: {
        marginTop: 40
    }
});

export default connect(
    (state, props) => {
        return {
            loading: state.changePassword.loading,
            error: state.changePassword.error,
            data: state.changePassword.data,
            form: state.changePassword.form,
            validCode: state.changePassword.validCode
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(ChangePassword);