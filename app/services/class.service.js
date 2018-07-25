import BackgroundTimer from 'react-native-background-timer';
import { Observable } from 'rxjs';
import { DeviceEventEmitter } from 'react-native';
import PushNotification from 'react-native-push-notification';

import storage from '../storage';
import data from '../middlewares/data';
import { d } from "../constants/days";

import moment from 'moment';
import 'moment/locale/es'
moment.locale('es')

class ClassService {
    constructor() {
        this.backgroundTimer = BackgroundTimer;
        this.milliseconds = 0;
        this.storage = storage;
        this.currentClass = null;
        this.observable = null;
        this.data = data;
        this.days = d;
        this.config = {
            // enables checkin button {n} minutes before class' start time
            checkinEnabledAt: 30,
            // disable checkin button {n} minutes before class' after time
            checkinDisabledAt: 30,
            // enables start class button {n} minutes before class' start time
            classEnabledAt: 1,
            // disable start class button {n} minutes before class' start time
            classDisabledAt: 1,
            // {n} minutes to finish class successfully
            validFinish: 30,
        }
    }
    getByID(id) {
        return new Promise((resolve, reject) => {
            this.storage.get('auth/teacher/classes').then(list => {
                if (list) {
                    let classData = this.complete(list.data.result);
                    for (let m in classData['data']) {
                        if (classData['data'][m]) {
                            for (let c in classData['data'][m]['classes']) {
                                if (classData['data'][m]['classes'][c] && classData['data'][m]['classes'][c].id === id) {
                                    classData['data'] = classData['data'][m]['classes'][c];
                                    resolve(classData);
                                    return;
                                }
                            }
                        }
                    }
                }
                reject({
                    response: {
                        data: 'Clase no encontrada'
                    }
                });
            });
        });
    }
    complete(data) {
        // let today = moment().format('DD-MM-YYYY'),
        let today = '26-07-2018',
        // // fullDate = moment().format('DD-MM-YYYY HH:mm'),
        fullDate = '26-07-2018 07:00',
        classes = {},
        freeDay = true,
        teacherBusy = false,
        classInProgress = this.current();
        classes[today] = []
        if (data) {
            for (let c in data) {
                let classData = data[c];
                classData.start = moment(classData.scheduleDate + ' ' + classData.scheduleTime.split(' - ')[0], 'DD-MM-YYYY HH:mm');
                classData.end = moment(classData.scheduleDate + ' ' + classData.scheduleTime.split(' - ')[1], 'DD-MM-YYYY HH:mm');
                if ((this.currentClass && this.currentClass.id === classData.id) || (classData.end.diff(moment(fullDate, 'DD-MM-YYYY HH:mm')) >= 0)) {
                    classData.duration = classData.end.diff(classData.start);
                    classData.scheduleStartTime = classData.start.format('hh:mm A');
                    classData.scheduleEndTime = classData.end.format('hh:mm A');
                    let days = '',
                    engDays = classData.scheduleDays.split(', ');
                    for (let day in engDays) {
                        days += this.days[engDays[day]].short;
                        if (day < (engDays.length - 1))
                            days += '-';
                    }
                    classData.scheduleDaysSpanish = days;
                    // classData.checkinEnabledAt = classData.start.subtract(this.config.checkinEnabledAt, 'minutes');
                    // classData.checkinDisabledAt = classData.start.add(this.config.checkinEnabledAt, 'minutes');
                    classData.checkinEnabledAt = moment('02-07-2018 23:59', 'DD-MM-YYYY HH:mm');
                    classData.checkinDisabledAt = moment('29-07-2018 23: 56', 'DD-MM-YYYY HH:mm');


                    // classData.classEnabledAt = classData.start.subtract(this.config.classEnabledAt, 'minutes');
                    // classData.classDisabledAt = classData.start.add(this.config.classDisabledAt, 'minutes');
                    classData.classEnabledAt = moment('02-07-2018 23:59', 'DD-MM-YYYY HH:mm');
                    classData.classDisabledAt = moment('29-07-2018 23: 56', 'DD-MM-YYYY HH:mm');

                    if (!classes[classData.scheduleDate])
                        classes[classData.scheduleDate] = [];
                    if (today === classData.scheduleDate)
                        classData.today = true;
                    let students = [];
                    classData.students.forEach(student => {
                        let name = student.name.split(' ');
                        student['initials'] = name[0][0];
                        if (name[1][0])
                            student['initials'] += name[1][0];
                        students.push(student);
                    });
                    classData.students = students;
                    classData.date = moment(classData.scheduleDate, 'DD-MM-YYYY').format('dddd, DD [de] MMMM');
                    classData.date = classData.date[0].toUpperCase() + classData.date.substr(1);
                    if (classData.checkInAtPlace && !classData.isCancelled && !classData.isFinished)
                        teacherBusy = true;
                    classes[classData.scheduleDate].push(classData);
                }
            }
            if (classes[today] && classes[today].length)
                freeDay = false;
            data = classes;
            classes = [];
            for (let date in data) {
                classes.push({
                    date: moment(date, 'DD-MM-YYYY').format('DD [de] MMMM'),
                    dayName: moment(date, 'DD-MM-YYYY').format('dddd'),
                    today: today === date ? true : null,
                    classes: data[date]
                })
            }
            data = classes;
        }
        return {
            data,
            freeDay,
            teacherBusy,
            classInProgress,
        };
    }
    update(classData) {
        this.storage.get('auth/teacher/classes').then(list => {
            for (let c in list.data.result) {
                if (list.data.result[c].id === classData.id) {
                    list.data.result[c] = classData;
                }
            }
            this.storage.set('auth/teacher/classes', list).then( res => {
                DeviceEventEmitter.emit('updateClassData');
            });
        });
    }
    createNotification(id, date, bigText, title, message) {
        PushNotification.localNotificationSchedule({
            /* Android Only Properties */
            bigText,
            color: "red", // (optional)
            id,
            userInfo: { id },
            date,
            title,
            message,
        });
    }
    timer(data) {
        if (!this.currentClass)
            this.currentClass = data;
        if (!this.observable) {
            this.createNotification(this.currentClass.id, this.currentClass.end.toDate(), 'Class finished', 'Text', 'Text');
            this.createNotification(this.currentClass.id + 1, this.currentClass.end.subtract(10, 'minute').toDate(), 'Class finished - 10min', 'Text', 'Text');
            this.createNotification(this.currentClass.id + 2, this.currentClass.end.add(10, 'minute').toDate(), 'Class finished + 10min', 'Text', 'Text');
            this.milliseconds = 0;
            this.observable = new Observable((observer) => {
                this.timerID = this.backgroundTimer.setInterval(() => {
                    this.milliseconds += 1000;
                    observer.next({
                        type: 'tick', 
                        value: this.milliseconds
                    });
                    if (this.currentClass.end.diff(moment()) < (this.config.validFinish * 60000)) {
                        observer.next({
                            type: 'validFinish', 
                            value: this.milliseconds
                        }); 
                    }
                }, 1000);
            });
        }
        this.update(this.currentClass);
        return this.observable;
    }
    finishTimer() {
        this.currentClass = null;
        this.observable = null;
        PushNotification.cancelAllLocalNotifications()
        this.backgroundTimer.clearTimeout(this.timerID);
    }
    checkIn(data) {
        data['checkInAtPlace'] = true;
        this.update(data);
    }
    current() {
        return this.currentClass;
    }

    // WEB SERVICES
    fetchClasses() {
        return this.data.get('auth/teacher/classes');
    }
    cancellationTypes() {
        return this.data.get('cancellationTypes');
    }
    classArrived(id, data) {
        return this.data.put('/auth/classes/' + id + '/teacherArrived', data);
    }
    started(id, data) {
        return new Promise((resolve, reject) => {
            this.data.put('/auth/classes/' + id + '/started', data).then(() => {
                this.getByID(id).then(res => {
                    res.data['isStartedLocally'] = true;
                    this.update(res.data);
                }).then(() => resolve(data), () => reject() );
            }, err => {
                reject(err);
            })
        })
    }
    finish(id, data, stopTimer) {
        return new Promise((resolve, reject) => {
            this.data.patch('/auth/classes/' + id , data).then(() => {
                this.getByID(id).then(res => {
                    if (data.isCancelled)
                        res.data['isCancelled'] = true;
                    else
                        res.data['isFinished'] = true;
                    this.update(res.data);
                    if (stopTimer)
                        this.finishTimer();
                }).then(() => resolve(data), () => reject() );
            }, err => {
                reject(err);
            })
        })
    }
}
export const classService = new ClassService();