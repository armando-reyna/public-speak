import React from 'react';
import {
    Image,
    Alert
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'

import storage from './storage';

import Index from './pages';
import Login from './pages/login';
import PasswordRecovery from './pages/password-recovery';
import ChangePassword from './pages/change-password';
import Dashboard from './pages/dashboard';
import ClassDetail from './pages/class-detail';
import ClassInProgress from './pages/class-in-progress';
import ClassFinishProcess from './pages/class-finish-process';
import ClassStudentConfirmation from './pages/class-student-confirmation';
import ClassReview from './pages/class-review';
import TransitionConfig from './transition.config';

const blueBackHeader = {
    headerStyle: {
        backgroundColor: 'rgba(51, 82, 103, 1)',
        height: 60,
        shadowOpacity: 0,
        shadowOffset: {
            height: 0,
        },
        shadowColor : '#5bc4ff',
        shadowRadius: 0,
        elevation: 0,
    },
    headerBackTitleStyle: {
        color: 'white',
    },
    headerTintColor: 'white',
    gesturesEnabled: true
},
noHeader = {
    header: null
};
export default createStackNavigator({
        Index: {
            screen: Index,
            navigationOptions: noHeader
        },
        Login: {
            screen: Login,
            navigationOptions: noHeader
        },
        PasswordRecovery: {
            screen: PasswordRecovery,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: 'white',
                    height: 60,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor : '#5bc4ff',
                    shadowRadius: 0,
                    elevation: 0,
                },
                // header: null,
                gesturesEnabled: true,
                headerBackTitleStyle: {
                    color: '#D75F77',
                },
                headerTintColor: '#D75F77',
            },
        },
        ChangePassword: {
            screen: ChangePassword,
            navigationOptions: noHeader
        },
        Dashboard: {
            screen: Dashboard,
            navigationOptions: ({ navigation, screenProps }) => (
                {
                    headerLeft: null,
                    headerTitle:
                            <Image
                                style={{
                                    width: 100,
                                    position: 'absolute',
                                    left: '50%',
                                    // transform: [{
                                    //     translateX: -50
                                    // }]
                                }} resizeMode="contain" source={require('./assets/min-logo.png')}
                            />,
                    headerStyle: {
                        backgroundColor: 'rgba(51, 82, 103, 1)',
                        height: 60,
                        // paddingLeft: 20,
                        // paddingRight: 20
                    },
                    headerTitleContainerStyle:{
                        alignSelf:'center',
                        // textAlign: 'center',
                        width: '50%',
                    },
                    headerRight:
                        <Icon size={24} name="more-vert" color="white" onPress={()=>{
                            Alert.alert(
                                'Cerrar sesión',
                                'Quieres continuar?',
                                [
                                    {
                                        text: 'Cancelar',
                                        onPress: () => { }, style: 'cancel'
                                    },
                                    {
                                        text: 'Sí', onPress: () => {
                                            storage.clear();
                                            navigation.navigate('Login');
                                        }
                                    },
                                ],
                                { cancelable: false }
                            )
                        }} />,
                    headerRightContainerStyle: {
                        marginRight: 20
                    },
                    headerLeftContainerStyle: {
                        width: 0
                    }
                }
            )
        },
        ClassDetail: {
            screen: ClassDetail,
            navigationOptions: blueBackHeader
        },
        ClassInProgress: {
            screen: ClassInProgress,
            navigationOptions: blueBackHeader
        },
        ClassFinishProcess: {
            screen: ClassFinishProcess,
            navigationOptions: blueBackHeader
        },
        ClassStudentConfirmation: {
            screen: ClassStudentConfirmation,
            navigationOptions: noHeader
        },
        ClassReview: {
            screen: ClassReview,
            navigationOptions: noHeader
        }
    },
    {
        stateName: 'MainStack',
        initialRouteName: 'Index',
        initialRouteParams: { transition: 'fade' },
        transitionConfig: TransitionConfig,
    }
);
