import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import * as adalLib from 'adal-angular';
import {OAuthData} from "./oauthdata.model";

@Injectable()
export class AdalService {

    private adalContext: adal.AuthenticationContext;
    private oauthData: OAuthData = {
        isAuthenticated: false,
        userName: '',
        loginError: '',
        profile: {}
    };

    public init(configOptions: adal.Config) {
        if (!configOptions) {
            throw new Error('You must set config, when calling init.');
        }

        // redirect and logout_redirect are set to current location by default
        var existingHash = window.location.hash;
        var pathDefault = window.location.href;
        if (existingHash) {
            pathDefault = pathDefault.replace(existingHash, '');
        }

        configOptions.redirectUri = configOptions.redirectUri || pathDefault;
        configOptions.postLogoutRedirectUri = configOptions.postLogoutRedirectUri || pathDefault;

        // create instance with given config
        this.adalContext = adalLib.inject(configOptions);

        window.AuthenticationContext = this.adalContext.constructor;

        // loginresource is used to set authenticated status
        this.updateDataFromCache(this.adalContext.config.loginResource);
    }

    public get config(): adal.Config {
        return this.adalContext.config;
    }

    public get userInfo(): OAuthData {
        return this.oauthData;
    }

    public login(): void {
        this.adalContext.login();
    }

    public loginInProgress(): boolean {
        return this.adalContext.loginInProgress();
    }

    public logOut(): void {
        this.adalContext.logOut();
    }

    public handleWindowCallback(): void {
        let hash = window.location.hash;
        if (this.adalContext.isCallback(hash)) {
            let requestInfo = this.adalContext.getRequestInfo(hash);
            this.adalContext.saveTokenFromHash(requestInfo);
            if (requestInfo.requestType === this.adalContext.REQUEST_TYPE.LOGIN) {
                this.updateDataFromCache(this.adalContext.config.loginResource);
                
            } else if (requestInfo.requestType === this.adalContext.REQUEST_TYPE.RENEW_TOKEN) {
                this.adalContext.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }

            if(requestInfo.stateMatch)
            {
                if (typeof this.adalContext.callback === 'function')
                {
                    if (requestInfo.requestType === this.adalContext.REQUEST_TYPE.RENEW_TOKEN) 
                    {
                        // Idtoken or Accestoken can be renewed
                        if (requestInfo.parameters['access_token']) 
                        {
                            this.adalContext.callback(this.adalContext._getItem(this.adalContext.CONSTANTS.STORAGE.ERROR_DESCRIPTION)
                                                        , requestInfo.parameters['access_token']);
                        }
                        else if (requestInfo.parameters['error']) 
                        {
                            this.adalContext.callback(this.adalContext._getItem(this.adalContext.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
                            this.adalContext._renewFailed = true;
                        }
                    }
                }
            }
        }
    }

    public getCachedToken(resource: string): string {
        return this.adalContext.getCachedToken(resource);
    }

    public acquireToken(resource: string) {
        return Observable.bindCallback((cb) => {
            this.adalContext.acquireToken(resource, function (error: string, tokenOut: string) {
                if (error) {
                    this.adalContext.error('Error when acquiring token for resource: ' + resource, error);
                    cb(null);
                } else {
                    cb(tokenOut);
                }
            });
        })();
    }

    public getUser(): Observable<adal.User> {
        return Observable.bindCallback((cb: (u: adal.User) => void) => {
            this.adalContext.getUser(function (error: string, user: adal.User) {
                if (error) {
                    this.adalContext.error('Error when getting user', error);
                    cb(null);
                } else {
                    cb(user);
                }
            });
        })();
    }

    public clearCache(): void {
        this.adalContext.clearCache();
    }

    public clearCacheForResource(resource: string): void {
        this.adalContext.clearCacheForResource(resource);
    }

    public info(message: string): void {
        this.adalContext.info(message);
    }

    public verbose(message: string): void {
        this.adalContext.verbose(message);
    }

    public GetResourceForEndpoint(url: string): string
    {
        return this.adalContext.getResourceForEndpoint(url);
    }

    private updateDataFromCache(resource: string): void {
        let token = this.adalContext.getCachedToken(resource);
        this.oauthData.isAuthenticated = token !== null && token.length > 0;
        var user = this.adalContext.getCachedUser() || { userName: '' };
        if(user)
        {
            this.oauthData.userName = user.userName;
            this.oauthData.profile = user.profile;
            this.oauthData.loginError = this.adalContext.getLoginError();
        }
        else
        {
            this.oauthData.userName = '';
            this.oauthData.profile = {};
            this.oauthData.loginError = '';
        }

    };
}
