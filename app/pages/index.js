import React, { Component } from 'react';
import {
  View,
  Linking,
  Platform
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from './index.actions';

import SplashScreen from 'react-native-splash-screen';
import LoaderScreen from '../components/loader-screen';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    componentDidMount() {
        this.props.checkSession().then((data) => {
            this.props.session ? this.props.navigation.replace('Dashboard') : this.props.navigation.replace('Login');
            SplashScreen.hide();
        }, err => {
            this.props.navigation.replace('Login');
            SplashScreen.hide();
        });
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.handleOpenURL(url);
            });
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
    }
    componentWillUnmount() {
      Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL(event) {
        if (!this.props.navigation.getParam('passwordChanged')) {
            url = event;
            if (url && url.url)
              url = url.url;
            if (url)
                this.props.navigation.replace('ChangePassword', { url: url })
        }
    }
    render() {
        return(
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                backgroundColor: 'white',
            }}>
                <LoaderScreen/>
            </View>
        );
    }
}

export default connect(
    (state, props) => {
        return {
            session: state.index.session,
            error: state.index.error
        }
    }, (dispatch) => {
        return bindActionCreators(Actions, dispatch);
    }
)(Index);