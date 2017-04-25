describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('http://sos1617-10.herokuapp.com/establishments');
		element(by.model('Apikey')).sendKeys('nurtrioje');
		var establishments
		element(by.buttonText('Access')).click().then(function (){
			establishments = element.all(by.repeater('establishment in establishments'));
		expect(establishments.count()).toBeGreaterThan(3);
		});
	});
});

describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('http://sos1617-10.herokuapp.com/beers');
		element(by.model('apikeyfield')).sendKeys('sos1617-jesusguerre');
		var beers
		element(by.buttonText('Access')).click().then(function (){
			beers = element.all(by.repeater('beer in beers'));
		expect(beers.count()).toBeGreaterThan(3);
		});
	});
});