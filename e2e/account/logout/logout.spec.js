const config = browser.params;
import UserModel from '../../../server/api/user/user.model';
import {LoginPage} from '../login/login.po';
import {NavbarComponent} from '../../components/navbar/navbar.po';

describe('Logout View', function() {
    const login = async (user) => {
        await browser.get(`${config.baseUrl}/login`);

        const loginPage = new LoginPage();
        await loginPage.login(user);
    };

    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
    };

    beforeEach(async function() {
        await UserModel
            .remove();

        await UserModel.create(testUser);

        await login(testUser);
    });

    after(function() {
        return UserModel.remove();
    });

    describe('with local auth', function() {
        it('should logout a user and redirect to "/home"', async function() {
            let navbar = new NavbarComponent();

            browser.ignoreSynchronization = false;
            await browser.wait(() => browser.getCurrentUrl(), 5000, 'URL didn\'t change after 5s');
            browser.ignoreSynchronization = true;

            (await browser.getCurrentUrl()).should.equal(`${config.baseUrl}/home`);
            (await navbar.navbarAccountGreeting.getText()).should.equal(`Hello ${testUser.name}`);

            await navbar.logout();

            navbar = new NavbarComponent();

            (await browser.getCurrentUrl()).should.equal(`${config.baseUrl}/home`);
            (await navbar.navbarAccountGreeting.isDisplayed()).should.equal(false);
        });
    });
});
