import { Component, OnInit } from '@angular/core';
import { HttpClient  } from "@angular/common/http";
import {SwUpdate, SwPush} from '@angular/service-worker';
import { PushNotificationService } from './service/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'PWADemo1';
  userObject:any;
  count=1;
  randomData: number[];
  userObjectCommnt: string;
   sub: PushSubscription;
  readonly VAPID_PUBLIC_KEY ="BIXkYQtZj7QqY4jln7NOIpFk5jr4qK03kSkD5j7jVdZcmbjUZ8KVe4fwTkYgmJdMRCBu2MvlU_jTCcpg5kvo4S8";

  constructor(private httpClient: HttpClient,
    private swUpdate: SwUpdate,
    private swPush : SwPush,
    private pushNotificationService: PushNotificationService){}

    ngOnInit() {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          if (confirm('New version available. Load New Version?')) {
            window.location.reload();
          }
        });
      }
      //check for value from cache and if not present show it from network.
      this.httpClient.get("https://jsonplaceholder.typicode.com/posts/"+this.count).subscribe((res:any)=>{
        this.userObjectCommnt = JSON.stringify(res.title);
    });
    this.count++;
    }

    subscribeToNotifications(){
    //   this.swPush.requestSubscription({
    //     serverPublicKey : this.VAPID_PUBLIC_KEY
    //   })
    //   .then(sub => {
    //         this.sub = sub;
    //         console.log("Notification Subscription: ", sub);
    //     console.log("Successful subscription to notifications", JSON.stringify(sub))
    // })
    //   .catch(err => console.error("Could not subscribe to notifications", err));

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
  })
  .then(sub => {

      this.sub = sub;


      console.log("Notification Subscription: ", sub);

      this.pushNotificationService.addPushSubscriber(sub).subscribe(
          () => console.log('Sent push subscription object to server.'),
          err =>  console.log('Could not send subscription object to server, reason: ', err)
      );

  })
  .catch(err => console.error("Could not subscribe to notifications", err));
    }

    sendPushnotification() {
      console.log("Sending Newsletter to all Subscribers ...");
      this.pushNotificationService.send().subscribe();
  }

  getNumber(){
    this.httpClient.get("https://jsonplaceholder.typicode.com/posts/"+this.count).subscribe((res:any)=>{
      this.userObject = JSON.stringify(res.id);
  });
  this.count++;
  }

    fetchData() {
      this.httpClient
          .get(
              'https://www.random.org/integers/?num=4&min=1&max=20&col=1&base=10&format=plain&rnd=new',
              { responseType: 'text' },
          )
          .subscribe(
              data => {
                  this.randomData = data
                      .split('\n')
                      .filter(n => !!n)
                      .map(n => parseInt(n, 10));
                  console.log(this.randomData);
              },
              err => {
                  console.error(err);
              },
          );
  }
}
