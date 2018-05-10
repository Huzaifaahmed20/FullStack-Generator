const config = browser.params;
import UserModel from '../../../server/api/user/user.model';
import {LoginPage} from './login.po';
import {NavbarComponent} from '../../components/navbar/navbar.po';

describe('Login View', function() {
    let page;

    const loadPage = () => {
        return browser.get(`${config.baseUrl}/login`).then(() => {
            page = new LoginPage();
        });
    };

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
    };

    before(async function() {
        await UserModel
            .remove();

        await UserModel.create(testUser);

        await loadPage();
    });

    after(function() {
        return UserModel.remove();
    });

    it('should include login form with correct inputs and submit button', function() {
        page.form.email.getAttribute('type').should.eventually.equal('email');
        page.form.email.getAttribute('name').should.eventually.equal('email');
        page.form.password.getAttribute('type').should.eventually.equal('password');
        page.form.password.getAttribute('name').should.eventually.equal('password');
        page.form.submit.getAttribute('type').should.eventually.equal('submit');
        page.form.submit.getText().should.eventually.equal('Login');
    });

    it('should include oauth buttons with correct classes applied', function() {
        page.form.oauthButtons.facebook.getText().should.eventually.equal('Connect with Facebook');
        page.form.oauthButtons.google.getText().should.eventually.equal('Connect with Google+');
        page.form.oauthButtons.twitter.getText().should.eventually.equal('Connect with Twitter');
    });

    describe('with local auth', function() {
        it('should login a user and redirect to "/home"', async function() {
            await page.login(testUser);

            let navbar = new NavbarComponent();

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            (await browser.getCurrentUrl()).should.equal(`${config.baseUrl}/home`);
            (await navbar.navbarAccountGreeting.getText()).should.equal(`Hello ${testUser.name}`);
        });

        describe('and invalid credentials', function() {
            before(() => loadPage());

            it('should indicate login failures', async function() {
                await page.login({
                    email: testUser.email,
                    password: 'badPassword'
                });

                (await browser.getCurrentUrl()).should.equal(`${config.baseUrl}/login`);

                let helpBlock = page.form.element(by.css('.form-group.has-error .help-block:not([hidden])'));

                browser.ignoreSynchronization = false;
                await browser.wait(() => helpBlock.getText(), 5000, 'Couldn\'t find help text after 5s');
                browser.ignoreSynchronization = true;

                (await helpBlock.getText()).should.equal('This password is not correct.');
            });
        });
    });
});
