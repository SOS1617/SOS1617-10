describe('Add establishment', function () {
	it('should add a new establishment', function (){
		browser.get('http://sos1617-10.herokuapp.com/establishments');

		element.all(by.repeater('establishment in establishments')).then(function (initialEstablishments){
				browser.driver.sleep(2000);
	
				element(by.model('newEstablishment.country')).sendKeys('spain');
				element(by.model('newEstablishment.year')).sendKeys(2014);
				element(by.model('newEstablishment.number')).sendKeys(47689);
				element(by.model('newEstablishment.beds')).sendKeys(3483000);
				element(by.model('newEstablishment.nights')).sendKeys(404000000);
				
				element(by.buttonText(' Add')).click().then(function (){

					element.all(by.repeater('establishment in establishments')).then(function (establishments){
						expect(establishments.length).toEqual(initialEstablishments.length+1);
					});
				
				});
			
		});
	});
});