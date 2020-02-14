import { PayloadLobbyPlayer } from "./PayloadLobbyPlayer";
import {PayloadPublicLobby} from "./PayloadPublicLobby"

export interface PayloadPrivateLobby extends PayloadPublicLobby {
    players: PayloadLobbyPlayer[]
}