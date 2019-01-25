import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IChatMessage {
    id?: number;
    text?: string;
    createdAt?: Moment;
    sender?: IUser;
    recipient?: IUser;
}

export class ChatMessage implements IChatMessage {
    constructor(public id?: number, public text?: string, public createdAt?: Moment, public sender?: IUser, public recipient?: IUser) {}
}
