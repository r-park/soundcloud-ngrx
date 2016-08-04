import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { bootstrap } from '@angular/platform-browser-dynamic';

// core
import { API_PROVIDERS } from './core/api';
import { EFFECTS_PROVIDERS } from './core/effects';
import { STORE_PROVIDERS } from './core/store';
import { TRACKLISTS_PROVIDERS } from './core/tracklists';

// route configuration
import { ROUTER_PROVIDERS } from './views/routes';

// root component
import { App } from './views/app';

// common styles
import './views/styles/common.scss';


if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}


document.addEventListener('DOMContentLoaded', () => {
  bootstrap(App, [
    disableDeprecatedForms(),
    provideForms(),
    API_PROVIDERS,
    EFFECTS_PROVIDERS,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    STORE_PROVIDERS,
    TRACKLISTS_PROVIDERS
  ]).catch((error: Error) => console.error(error));
});
