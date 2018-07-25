import http from '../http';
import storage from '../storage';
import { NetInfo } from 'react-native';

class Data {
    constructor() {
        this.storage = storage;
        this.session = {};
        this.netInfo = NetInfo;
    }
    get (...opts) {
        return new Promise((resolve, reject) => {
            http.get(opts[0]).then(httpRes => {
                this.storage.set(opts[0], httpRes);
                resolve(httpRes);
            }).catch(httpErr => {
                this.storage.get(opts[0]).then(data => {
                    resolve(data);
                }, err => {
                    reject(httpErr);
                })
            })
        });
    }
    put (...opts) {
        return new Promise((resolve, reject) => {
            http.put(opts[0], opts[1]).then(httpRes => {
                resolve(httpRes);
            }).catch(httpErr => {
                this.setPendingRequest('put', opts).then(data => {
                    resolve(data);
                }, err => {
                    reject(httpErr);
                })
            })
        });
    }
    patch (...opts) {
        return new Promise((resolve, reject) => {
            http.patch(opts[0], opts[1]).then(httpRes => {
                resolve(httpRes);
            }).catch(httpErr => {
                this.setPendingRequest('patch', opts).then(data => {
                    resolve(data);
                }, err => {
                    reject(httpErr);
                })
            })
        });
    }
    post (...opts) {
        return new Promise((resolve, reject) => {
            http.post(opts[0], opts[1]).then(httpRes => {
                resolve(httpRes);
            }).catch(httpErr => {
                httpErr = this.handleHttpError(httpErr);
                this.setPendingRequest('post', opts).then(data => {
                    resolve(data);
                }, err => {
                    reject(httpErr);
                })
            })
        });
    }
    pendingData(type, url, data, array) {
        if (!array)
            array = [];
        array.push({
            requestType: type,
            url: url,
            data: data
        })
        return new Promise((resolve, reject) => {
            this.storage.set('pendingRequest', array).then(data => {
                resolve(data);
            }, err => {
                reject(err);
            });
        });
    }
    setPendingRequest(type, opts) {
        return new Promise((resolve, reject) => {
            this.netInfo.isConnected.fetch().then(isConnected => {
                if (!isConnected) {
                    this.storage.get('pendingRequest').then(array => {
                        this.pendingData(type, opts[0], opts[1], array).then(data => {
                            resolve(data);
                        }, err => {
                            reject();
                        });
                    }, err => {
                        this.pendingData(type, opts[0], opts[1]).then(data => {
                            resolve(data);
                        }, err => {
                            reject();
                        });
                    });
                } else {
                    reject();
                }
            });
        });
    }
}
export default data = new Data();