const config = browser.params;
import UserModel from '../../../server/api/user/user.model';
import {SignupPage} from './signup.po';
import {NavbarComponent} from '../../components/navbar/navbar.po';

describe('Signup View', function() {
    let page;

    const loadPage = () => {
        browser.manage().deleteAllCookies();
        return browser.get(`${config.baseUrl}/signup`).then(() => {
            page = new SignupPage();
        });
    };

    const testUser = {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@example.com',
        password: 'test1234',
        confirmPassword: 'test1234'
    };

    before(() => loadPage());

    after(() => {
        return UserModel.remove();
    });

    it('should include signup form with correct inputs and submit button', function() {
        page.form.name.getAttribute('type').should.eventually.equal('text');
        page.form.name.getAttribute('name').should.eventually.equal('firstName');
        page.form.name.getAttribute('name').should.eventually.equal('lastName');
        page.form.email.getAttribute('type').should.eventually.equal('email');
        page.form.email.getAttribute('name').should.eventually.equal('email');
        page.form.password.getAttribute('type').should.eventually.equal('password');
        page.form.password.getAttribute('name').should.eventually.equal('password');
        page.form.confirmPassword.getAttribute('type').should.eventually.equal('password');
        page.form.confirmPassword.getAttribute('name').should.eventually.equal('confirmPassword');
        page.form.submit.getAttribute('type').should.eventually.equal('submit');
        page.form.submit.getText().should.eventually.equal('Sign up');
    });

    it('should include oauth buttons with correct classes applied', function() {
        page.form.oauthButtons.facebook.getText().should.eventually.equal('Connect with Facebook');
        page.form.oauthButtons.google.getText().should.eventually.equal('Connect with Google+');
        page.form.oauthButtons.twitter.getText().should.eventually.equal('Connect with Twitter');
    });

    describe('with local auth', function() {
        before(() => {
            return UserModel.remove();
        });

        it('should signup a new user, log them in, and redirecting to "/"', async function() {
            await page.signup(testUser);

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            let navbar = new NavbarComponent();

            (await browser.getCurrentUrl()).should.equal(`${config.baseUrl}/home`);
            (await navbar.navbarAccountGreeting.getText()).should.equal(`Hello ${testUser.name}`);
        });

        describe('and invalid credentials', function() {
            before(() => loadPage());

            it('should indicate signup failures', async function() {
                await page.signup(testUser);

                browser.ignoreSynchronization = false;
                await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
                browser.ignoreSynchronization = true;

                (await browser.getCurrentUrl()).should.equal(`${config.baseUrl}/signup`);

                let helpBlock = page.form.element(by.css('.form-group.has-error .help-block:not([hidden])'));
                (await helpBlock.getText()).should.equal('This email address is already in use.');
            });
        });
    });
});
