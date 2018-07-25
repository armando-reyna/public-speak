import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import Input from '../../components/input';
import Button from '../../components/button';
import LoaderScreen from '../../components/loader-screen';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './login.actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    submit() {
        if (this.props.form.valid) {
            this.props.login(this.props.form.email, this.props.form.password).then((data) => {
                if(this.props.error)
                    this.loader.error();
                else {
                    this.props.navigation.replace('Dashboard');
                }
            });
        } else if (!this.props.form.email) {
            this.emailInput.focus();
        } else {
            this.passwordInput.focus();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../assets/logo.png')} style={ styles.logo } resizeMode="contain" />
                <Input placeholder="Email" type="email-address" errorMessage="Email inválido" icon="cancel" returnKeyType={'next'}
                    reference={input => this.emailInput = input}
                    onChange={(value) => this.props.updateProperty('email', value)}
                    next={() => { this.submit() }}
                />
                <Input placeholder="Contraseña" password={true} icon="remove-red-eye" returnKeyType={'done'}
                    reference={input => this.passwordInput = input}
                    onChange={(value) => this.props.updateProperty('password', value)}
                    next={() => { this.submit() }}
                />
                {/* <Checkbox text="Recordar contraseña"/> */}
                <Button
                    onPress={() => this.submit() }
                    style={{
                        width: '100%'
                    }} text="INICIAR SESIÓN"
                />
                <Button
                    onPress={() => {
                        this.props.navigation.navigate('PasswordRecovery', { transition: 'horizontal' });
                    }}
                    secondary={true}
                    style={styles.secondaryButton}
                    text="OLVIDÉ MI CONTRASEÑA"/>
                { (this.props.loading || this.props.error) && 
                    <LoaderScreen 
                        reference={loader => this.loader = loader}
                        errorText={this.props.error ? this.props.error.message : ''}
                        errorButtonText="REINTENTAR"
                        errorButton={() => {
                            this.loader.exit().then(() => {
                                this.props.hideLoader();
                            })
                        }}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
    },
    logo: {
        width: '60%',
        maxWidth: 120,
        marginBottom: 20
    },
    secondaryButton: {
        marginTop: 40
    }
});

export default connect(
    (state, props) => {
        return {
            loading: state.login.loading,
            error: state.login.error,
            data: state.login.data,
            form: state.login.form,
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(Login);