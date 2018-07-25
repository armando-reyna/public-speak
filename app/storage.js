import {
    AsyncStorage
} from 'react-native';

class Storage {
    constructor() {}
    complete(text) {
        return '@SPEAK::' + String(text).toUpperCase();
    }
    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    async set(name, value) {
        // if (value.data && value.data.result) {
        //     value.data.result.splice(8, value.data.result.length)
        // }
        value = JSON.stringify(value);
        return await AsyncStorage.setItem(this.complete(name), value);
    }
    async get(name) {
        return await AsyncStorage.getItem(this.complete(name)).then(data => {
            if (data && this.isJson(data)) {
                data = JSON.parse(data.replace(/\"/g, '"').replace(/\\\\/g, '\\'));
            }
            return data;
        });
    }
    remove(name) {
        return AsyncStorage.removeItem(name);
    }
    clear() {
        return AsyncStorage.clear();
    }
};
export default storage = new Storage();