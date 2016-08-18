import { enableProdMode } from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { bootstrap } from '@angular/platform-browser-dynamic';

// core
import { API_PROVIDERS } from './core/api';
import { BROWSER_PROVIDERS } from './core/browser';
import { EFFECTS_PROVIDERS } from './core/effects';
import { PLAYER_PROVIDERS } from './core/player';
import { SEARCH_PROVIDERS } from './core/search';
import { STORE_PROVIDERS } from './core/store';
import { TRACKLISTS_PROVIDERS } from './core/tracklists';

// route configuration
import { ROUTER_PROVIDERS } from './views/routes';

// root component
import { AppComponent } from './views/app';

// common styles
import './views/styles/common.scss';


if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}


document.addEventListener('DOMContentLoaded', () => {
  bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    API_PROVIDERS,
    BROWSER_PROVIDERS,
    EFFECTS_PROVIDERS,
    HTTP_PROVIDERS,
    PLAYER_PROVIDERS,
    ROUTER_PROVIDERS,
    SEARCH_PROVIDERS,
    STORE_PROVIDERS,
    TRACKLISTS_PROVIDERS
  ]).catch((error: Error) => console.error(error));
});
