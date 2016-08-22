import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/Observable/bindCallback'
import {AdalService} from './adal.service';


@Injectable()
export class AuthHttp
{

    constructor(private http: Http
    ,private adalService : AdalService
    ) { }

    get(url:string) : Observable<any> {
        console.info("Fecthing content for " + url);
        if( this.adalService.userInfo.isAuthenticated)
         {
             var resource = this.adalService.GetResourceForEndpoint(url);
             var authenticatedCall = this.http.get(url).map(this.extractData).catch(this.handleError);
             if(resource)
             {
                console.info("User authenticated " + url);
                authenticatedCall = this.adalService.acquireToken(resource)
                .flatMap((token:string) => {
                    var authHeader = new Headers();
                    authHeader.append('Authorization', 'Bearer ' + token);
                    console.info("Got access token and now fetching" + url);
                    return this.http.get(url, {headers: authHeader})
                    .map(this.extractData)
                    .catch(this.handleError);
                });
             }

             return  authenticatedCall;
         }

         return  Observable.throw(new Error("User Not Authenticated."));
        
    }

    post(url: string, body: any) : Observable<any>
    {
        if( this.adalService.userInfo.isAuthenticated)
         {
             var resource = this.adalService.GetResourceForEndpoint(url);
             var authenticatedCall = this.http.post(url, body).map(this.extractData).catch(this.handleError);
             if(resource)
             {
                authenticatedCall = this.adalService.acquireToken(resource)
                .flatMap((token:string) => {
                    var authHeader = new Headers();
                    authHeader.append('Authorization', 'Bearer ' + token);
                    return this.http.post(url, body, {headers: authHeader})
                    .catch(this.handleError);
                });
             }

             return  authenticatedCall;
         }

         return  Observable.throw(new Error("User Not Authenticated."));
    }

    delete(url: string): Observable<any>
    {
        if( this.adalService.userInfo.isAuthenticated)
         {
             var resource = this.adalService.GetResourceForEndpoint(url);
             var authenticatedCall = this.http.delete(url).map(this.extractData).catch(this.handleError);
             if(resource)
             {
                authenticatedCall = this.adalService.acquireToken(resource)
                .flatMap((token:string) => {
                    var authHeader = new Headers();
                    authHeader.append('Authorization', 'Bearer ' + token);
                    return this.http.delete(url, {headers: authHeader})
                    .catch(this.handleError);
                });
             }

             return  authenticatedCall;
         }

         return  Observable.throw(new Error("User Not Authenticated."));
    }


    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        let body = res.json();
        
        return body || {};
    }
    private handleError(error: any) {
        debugger;
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(JSON.stringify(error)); // log to console instead

        return Observable.throw(error);
    }
}
