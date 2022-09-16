import { io } from "socket.io-client";
import { IMessage } from "../models/message";

export const socket = io(process.env.REACT_APP_DOABLE_API!);

export const messagesStorage: IMessage[] = [];
