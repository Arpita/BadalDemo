import { Injectable } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';

@Injectable({
  providedIn: 'root'
})

export class InterceptorService  implements HttpInterceptor {

  constructor(private admin:AdminService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  {
    // Clone the request to add the new header.
    let token = localStorage.getItem("token");
    if(token)
    {
      req = req.clone({ headers: req.headers.set("token", token)});
    }


    return next.handle(req).pipe(tap((event: HttpEvent<any>) => { 
      if (event instanceof HttpResponse) {
      }
    },
    (err: any) => {

      if (err instanceof HttpErrorResponse) {
        console.log(err)
        if(err.error.statusCode==401) {
        this.admin.errorAlert(err.error.message,true);
        } else if(err.error.statusCode==403) {
        this.admin.errorAlert(err.error.message,true);
        }
        else {
        this.admin.errorAlert(err.error.message,false);
        }
      }
  }));
}
}
