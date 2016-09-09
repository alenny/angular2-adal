import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptionsArgs, RequestOptions, RequestMethod, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/Observable/bindCallback'
import {AdalService} from './adal.service';

@Injectable()
export class AuthHttp
{
    constructor(private http: Http
    ,private adalService : AdalService
    ) { }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Get});
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    post(url: string, body: any, options?: RequestOptionsArgs) : Observable<any>
    {
        let options1 = new RequestOptions({ method: RequestMethod.Post });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<any>
    {
        let options1 = new RequestOptions({ method: RequestMethod.Delete });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    private sendRequest(url: string, options: RequestOptionsArgs): Observable<any>
    {
        //make a copy
        let options1 = new RequestOptions();
        options1.method = options.method;

        if (options.search != null) {
            options1.search = new URLSearchParams(options.search.toString()).clone();
        }

        if (options.headers != null) {
            options1.headers = new Headers(options.headers.toJSON());
        }

        if (this.adalService.userInfo.isAuthenticated) {
            var resource = this.adalService.GetResourceForEndpoint(url);
            var authenticatedCall = this.http.request(url, options).map(this.extractData).catch(this.handleError);
            if (resource) {
                authenticatedCall = this.adalService.acquireToken(resource)
                    .flatMap((token: string) => {
                        if (options1.headers == null) {
                            options1.headers = new Headers();
                        }
                        options1.headers.append('Authorization', 'Bearer ' + token);
                        return this.http.request(url, options1)
                            .catch(this.handleError);
                    });
            }

            return authenticatedCall;
        }

        return Observable.throw(new Error("User Not Authenticated."));
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