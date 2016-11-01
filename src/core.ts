import {AdalService, AuthHttp} from './services';

export * from './services';

export const ANGULAR2_ADAL_PROVIDERS: any[] = [
    {
        provide: AdalService,
        useClass: AdalService
    }
];