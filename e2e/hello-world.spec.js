    // TODO: this is only a temporary solution
var waitForAngularReady = function () {
    return browser.driver.wait(
      protractor.until.elementLocated(By.tagName('template')), 10000);
};

describe('Hello World example', function() {

    var url = 'http://code.angular2buch.de/hello-world/';

    beforeEach(function() {
      browser.get(url);
      waitForAngularReady();
    });

    it('should show the title', function() {
        expect(browser.getTitle()).toEqual('Angular 2 - Hello World example');
    });

    it('should show all authors', function() {

        element.all(by.tagName('li')).then(function(authorEl) {

            expect(authorEl[0].getText()).toEqual('Danny');
            expect(authorEl[1].getText()).toEqual('Ferdinand');
            expect(authorEl[2].getText()).toEqual('Johannes');
            expect(authorEl[3].getText()).toEqual('Gregor');
          }
        );
    });
});
