import { Component, OnInit } from '@angular/core';
import { HttpClient  } from "@angular/common/http";
import {SwUpdate} from '@angular/service-worker';

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

  constructor(private httpClient: HttpClient,
    private swUpdate: SwUpdate){}

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
