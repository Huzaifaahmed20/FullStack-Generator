import { safeCb } from './util';


describe('Util', () => {
    it('Has a safeCb function', () => {
        let notAFunction;

        safeCb(notAFunction).should.not.throw(Error);
    });
});
