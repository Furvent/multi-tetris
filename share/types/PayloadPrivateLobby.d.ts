import { PayloadLobbyUser } from "./PayloadLobbyUser";
import {PayloadPublicLobby} from "./PayloadPublicLobby"

export interface PayloadPrivateLobby extends PayloadPublicLobby {
    lobbyUsers: PayloadLobbyUser[]
}