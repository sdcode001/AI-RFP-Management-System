import {io, Socket} from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Config } from '../../config';

@Injectable({providedIn: 'root'})
export class SocketServerService {
  private socket!: Socket
  
  connect(){
    const instance_url = Config.API_BASE_URL;
    this.socket = io(instance_url);
  }
  
  emit(event: string, data: any){
    if(this.socket != null){
        this.socket.emit(event, data);
    }
    else{
        console.log('Socket server not connected!')
    }
  }

  on(event: string): Observable<any>{
     return new Observable(observer => {
        this.socket.on(event, (data) => {
            observer.next(data);
        })
     })
  }

  disconnect(){
    if(this.socket != null){
        this.socket.disconnect();
    }
  }

}