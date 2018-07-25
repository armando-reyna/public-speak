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

import * as Actions from './password-recovery.actions';

class PasswordRecovery extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }
    componentDidMount() {
        let email = this.props.navigation.getParam('email');
        this.props.updateProperty('email', email);
        if (email)
            this.submit();
    }
    submit() {
      if (this.props.form.valid) {
        this.props.resetPasswordAction(this.props.form.email).then((data) => {
          if(this.props.error)
            this.loader.error();
          else {
            this.loader.success();
          }
        });
      } else {
        this.emailInput.focus();
      }
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={{
                    fontSize: 24,
                    marginBottom: 15,
                    color: 'rgba(0,0,0,0.87)',
                    fontFamily: "EuphemiaUCAS",
                    lineHeight: 32,
                    textAlign: 'center'
                }}>¿Olvidaste tu contraseña?</Text>
                <Text style={{
                    fontSize: 14,
                    color: 'rgba(0,0,0,0.87)',
                    fontFamily: "EuphemiaUCAS",
                    lineHeight: 20,
                    textAlign: 'center'
                }}>Escribe tu email y enseguida te enviaremos una nueva contraseña.</Text>
                <Input placeholder="Email" type="email-address" errorMessage="Email inválido" icon="cancel"
                       reference={input => this.emailInput = input}
                       onChange={(value) => this.props.updateProperty('email', value)}
                       next={() => { this.submit() }}/>
              <Button
                  onPress={() => { this.submit() } }
                  style={{
                    width: '100%',
                    marginTop: 70
                  }} text="SOLICITAR NUEVA CONTRASEÑA"
              />
              { (this.props.loading || this.props.error || this.props.data) && 
                  <LoaderScreen 
                      reference={loader => this.loader = loader}
                      successText={this.props.data ? 'Se ha enviado un correo para restablecer la contraseña' : ''}
                      auto={{
                          delay: 3000,
                          success: () => {
                                this.props.hideLoader();
                                this.props.navigation.navigate('ChangePassword', {
                                    email: this.props.form.email
                                });
                          }
                      }}
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
    }
});

export default connect(
    (state, props) => {
      return {
        loading: state.passwordRecovery.loading,
        error: state.passwordRecovery.error,
        data: state.passwordRecovery.data,
        form: state.passwordRecovery.form,
      }
    }, (dispatch) => {
      return bindActionCreators(Actions, dispatch);
    }
)(PasswordRecovery);
