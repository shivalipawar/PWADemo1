import { Component, OnInit } from '@angular/core';
import { HttpClient  } from "@angular/common/http";
import {SwUpdate, SwPush} from '@angular/service-worker';
import { PushNotificationService } from './service/push-notification.service';
import { Observable } from 'rxjs';
import { NgNavigatorShareService } from 'ng-navigator-share';

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
  private ngNavigatorShareService: NgNavigatorShareService;

  constructor(private httpClient: HttpClient,
    private swUpdate: SwUpdate,
    private swPush : SwPush,
    private pushNotificationService: PushNotificationService,
    ngNavigatorShareService: NgNavigatorShareService){
        this.ngNavigatorShareService = ngNavigatorShareService;
    }

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

  downloadPdf(): Observable<Blob>{
    let uri = 'http://www.africau.edu/images/default/sample.pdf';
    // Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    return this.httpClient.get(uri, { responseType: 'blob' });
  }

  public showPDF(): void {
    this.downloadPdf()
        .subscribe(x => {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            var newBlob = new Blob([x], { type: "application/pdf" });

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }

            // For other browsers: 
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);
            console.log("URL is "+data);

            var link = document.createElement('a');
            link.href = data;
            link.download = "Je kar.pdf";
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
        });
}

share() {
    this.ngNavigatorShareService.share({
      title: 'My Awesome app',
      text: 'hey check out my Shared pdf file',
      url: 'http://www.africau.edu/images/default/sample.pdf'
    }).then( (response) => {
      console.log(response);
    })
    .catch( (error) => {
      console.log(error);
    });
  }

}
