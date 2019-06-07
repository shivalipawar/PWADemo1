import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  constructor(private http: HttpClient) { }

  addPushSubscriber(sub:any) {
    console.log("Trying to subscribe to push notification");
    return this.http.post('http://localhost:9000/api/notifications', sub);
}

send() {
    console.log("Trying to send push notification");
    return this.http.post('http://localhost:9000/api/sendnotification', null);
}
}
