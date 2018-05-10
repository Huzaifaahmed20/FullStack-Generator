import { Component } from '@angular/core';

@Component({
    selector: 'oauth-buttons',
    template: require('./oauth-buttons.html'),
    styles: [require('./oauth-buttons.css')],
})
export class OauthButtonsComponent {
    loginOauth(provider) {
        window.location.href = `/auth/${provider}`;
    }
}
