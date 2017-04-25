var fs = require('fs');

function writeScreenShot(data, filename) {
	var stream = fs.createWriteStream(filename);
	stream.write(new Buffer(data, 'base64'));
	stream.end();
}

describe('Add establishment', function() {
	it('should add a new establishment', function() {
		browser.get('http://sos1617-10.herokuapp.com/#!/establishments');
		element(by.model('Apikey')).sendKeys('nurtrioje');

		element(by.buttonText('Access')).click().then(function() {

			element.all(by.repeater('establishment in establishments')).then(function(initialEstablishments) {
				browser.driver.sleep(2000);

				element(by.model('newEstablishment.country')).sendKeys('spain');
				element(by.model('newEstablishment.year')).sendKeys(2014);
				element(by.model('newEstablishment.number')).sendKeys(47689);
				element(by.model('newEstablishment.beds')).sendKeys(3483000);
				element(by.model('newEstablishment.nights')).sendKeys(404000000);

				element(by.buttonText('Add')).click().then(function() {

					element.all(by.repeater('establishment in establishments')).then(function(establishments) {
						expect(establishments.length).toEqual(initialEstablishments.length + 1);
					});

				});

			});
		});

	});



});
describe('Add beer', function() {
	it('should add a new beers', function() {
		browser.get('http://sos1617-10.herokuapp.com/#!/beers/');
		element(by.model('apikeyfield')).sendKeys('jesusguerre');

		element(by.buttonText('Access')).click().then(function() {


			element.all(by.repeater('beer in beers')).then(function(initialBeers) {


				browser.driver.sleep(2000);

				element(by.buttonText('Add')).click()
				browser.driver.sleep(2000);



				element(by.model('newBeer.name')).sendKeys("test");
				element(by.model('newBeer.country')).sendKeys("Spain");
				element(by.model('newBeer.birthyear')).sendKeys("1890");
				element(by.model('newBeer.province')).sendKeys("Sevilla");



				element(by.buttonText('Add Beer')).click().then(function() {
					browser.driver.sleep(2000);

					element.all(by.repeater('beer in beers')).then(function(beers) {
						expect(beers.length).toEqual(initialBeers.length + 1);
					});

				});

			});
		});

	});



});
