import http from '../http';
import storage from '../storage';

class UserService {
    constructor() {
        this.storage = storage;
        this.session = {};
    }
    checkSession() {
        return this.storage.get('session').then(data => {
            this.save(data);
            return data;
        });
    }
    save(data) {
        this.session = data;
        this.storage.set('session', data);
        http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        http.defaults.headers.common['Auth'] = http.defaults.headers.common['Authorization'];
    }
    login(username, password) {
        return new Promise((resolve, reject) => {
            http.post('login', { username: username, password: password}).then(res => {
                this.save(res.data.result);
                resolve(res);
            }, err => {
                reject(err);
            });
        })
    }
    resetPassword(username) {
        return http.post('resetPassword', { username: username})
    }
    verifyCode(code, email) {
        return http.post('resetPassword/verify', {
            username: email,
            code: code
        })
    }
    updatePassword(password, token) {
        return http.put('user/password', {
            token: token,
            password: password
        });
    }
}
export const userService = new UserService();