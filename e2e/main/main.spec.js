let config = browser.params;
import {MainPage} from './main.po';

describe('Main View', function() {
    let page;

    beforeEach(() => {
        return browser.get(`${config.baseUrl}/`).then(() => {
            page = new MainPage();
        });
    });

    it('should include jumbotron with correct data', function() {
        page.h1El.getText().should.eventually.equal('\'Allo, \'Allo!');
        page.imgEl.getAttribute('src').should.eventually.match(/yeoman(\.[a-zA-Z0-9]*)?\.png$/);
        page.imgEl.getAttribute('alt').should.eventually.equal('I\'m Yeoman');
    });
});
