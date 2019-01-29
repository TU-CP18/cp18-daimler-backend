import { ChatMessageService } from './../chat-message/chat-message.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IChatMessage } from 'app/shared/model/chat-message.model';
import { Injectable } from '@angular/core';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { IUser, Principal, UserService } from 'app/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

import SockJS = require('sockjs-client');
import Stomp = require('webstomp-client');
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class ChatService {
    alreadyConnectedOnce = false;
    connectedPromise: any;
    connection: Promise<any>;
    listener: Observable<any>;
    listenerObserver: Observer<any>;
    safetyDriver: ISafetyDriver;
    backendUser: IUser;
    appUser: IUser;
    stompClient = null;
    subscriber = null;
    topic = null;
    private subscription: Subscription;
    private messageObjectService: ChatMessageService;

    constructor(
        private http: HttpClient,
        private router: Router, // private $window: Window,
        private principal: Principal,
        private chatMessageService: ChatMessageService,
        private userService: UserService
    ) {
        this.connection = this.createConnection();
        this.listener = this.createListener();
    }

    connect(safetyDriver: ISafetyDriver) {
        if (this.connectedPromise === null) {
            this.connection = this.createConnection();
        }
        // building absolute path so that websocket doesnt fail when deploying with a context path
        // const loc = this.$window.location;
        const url = 'http://localhost:8080/websocket/chat/';
        // const authToken = this.authServerProvider.getToken();
        // if (authToken) {
        //     url += '?access_token=' + authToken;
        // }
        this.safetyDriver = safetyDriver;
        this.topic = '/topic/public/' + safetyDriver.id;
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        const headers = {};
        this.stompClient.connect(headers, () => {
            this.connectedPromise('success');
            this.connectedPromise = null;
            this.unsubscribe();
            this.subscribe();
            if (!this.alreadyConnectedOnce) {
                this.alreadyConnectedOnce = true;
            }
        });
        // get user object of current user (FM)
        this.principal.identity().then(account => {
            this.userService.find(account.login).subscribe(
                backendUser => {
                    this.backendUser = backendUser.body;
                },
                () => {
                    console.log('Error retrieving backend user.');
                }
            );
        });
        // get user object of safety driver (of current chat)
        this.userService.find(safetyDriver.login).subscribe(
            appUser => {
                this.appUser = appUser.body;
            },
            () => {
                console.log('Error when retrieving safety driver user.');
            }
        );
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.alreadyConnectedOnce = false;
    }

    receive() {
        return this.listener;
    }

    sendMessage(message: string) {
        if (this.stompClient !== null && this.stompClient.connected) {
            // create message
            const messageObject = {
                _id: Date.now(),
                user: {
                    _id: this.backendUser.id,
                    avatar: 'https://placeimg.com/140/140/any'
                },
                sender: 'backenduser',
                content: message,
                text: message,
                createdAt: new Date(),
                type: 'CHAT'
            };
            // send message via websocket
            this.stompClient.send(this.topic, JSON.stringify(messageObject), {});
            // save to database
            this.chatMessageService
                .create(<IChatMessage>{
                    recipient: this.appUser,
                    sender: this.backendUser,
                    text: message,
                    createdAt: moment()
                })
                .subscribe(
                    () => {
                        /* console.log('send message success'); */
                    },
                    () => {
                        console.log('Error on saving sent message to database.');
                    }
                );
        } else {
            console.log('STOMP ERROR');
        }
    }

    onReceivedMessage = data => {
        const dataObject = JSON.parse(data.body);
        this.listenerObserver.next(dataObject);
        if (dataObject.user._id !== this.backendUser.id) {
            // save to database
            this.chatMessageService
                .create(<IChatMessage>{
                    recipient: this.backendUser,
                    sender: this.appUser,
                    text: dataObject.content,
                    createdAt: moment()
                })
                .subscribe(
                    () => {
                        /* console.log('send message success'); */
                    },
                    () => {
                        console.log('Error on saving received message to database.');
                    }
                );
        }
    };

    subscribe() {
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe(this.topic, this.onReceivedMessage);
        });
    }

    unsubscribe() {
        if (this.subscriber !== null) {
            this.subscriber.unsubscribe();
        }
        this.listener = this.createListener();
    }

    private createListener(): Observable<any> {
        return new Observable(observer => {
            this.listenerObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => (this.connectedPromise = resolve));
    }
}
