describe('Data is loaded', function () {
	it('should show a bunch of data', function (){
		browser.get('http://sos1617-10.herokuapp.com/establishments');
		var establishments = element.all(by.repeater('establishment in establishments'));
		expect(establishments.count()).toBeGreaterThan(5);
	});
});