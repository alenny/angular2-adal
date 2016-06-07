import {provide} from "@angular/core";
import {AdalService} from './services';

export * from './services';

export const ANGULAR2_ADAL_PROVIDERS: any[] = [
    provide(AdalService, {useClass: AdalService})
];