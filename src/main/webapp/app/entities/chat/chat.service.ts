import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ISafetyDriver } from 'app/shared/model/safety-driver.model';
import { Observable, Observer, Subscription } from 'rxjs';

type EntityResponseType = HttpResponse<ISafetyDriver>;
type EntityArrayResponseType = HttpResponse<ISafetyDriver[]>;

import SockJS = require('sockjs-client');
import Stomp = require('webstomp-client');

@Injectable({ providedIn: 'root' })
export class ChatService {
    stompClient = null;
    subscriber = null;
    connection: Promise<any>;
    connectedPromise: any;
    listener: Observable<any>;
    listenerObserver: Observer<any>;
    alreadyConnectedOnce = false;
    topic = null;
    private subscription: Subscription;

    constructor(
        private http: HttpClient,
        private router: Router // private $window: Window,
    ) // private csrfService: CSRFService
    {
        this.connection = this.createConnection();
        this.listener = this.createListener();
    }

    connect(safetyDriverId) {
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
        this.topic = '/topic/public/' + safetyDriverId;
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        const headers = {};
        this.stompClient.connect(headers, () => {
            this.connectedPromise('success');
            this.connectedPromise = null;
            this.unsubscribe();
            this.subscribe(safetyDriverId);
            if (!this.alreadyConnectedOnce) {
                this.alreadyConnectedOnce = true;
            }
        });
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
        // console.log('Service sendMessage:');
        if (this.stompClient !== null && this.stompClient.connected) {
            // this.stompClient.send(
            //     '/topic/public', // destination
            //     {}, // header
            //     JSON.stringify({'message': message}), // body
            // );
            const chatMessage = {
                _id: Date.now(),
                user: {
                    _id: 33,
                    avatar: 'https://placeimg.com/140/140/any'
                },
                sender: 'backenduser',
                content: message,
                text: message,
                createdAt: new Date(),
                type: 'CHAT'
            };
            this.stompClient.send(this.topic, JSON.stringify(chatMessage), {});
        } else {
            console.log('STOMP ERROR');
        }
    }

    subscribe(safetyDriverId: string) {
        // console.log('topic: ' + this.topic);
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe(this.topic, data => {
                this.listenerObserver.next(JSON.parse(data.body));
            });
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
