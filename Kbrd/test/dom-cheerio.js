var assert = require('assert');

var cheerio = require('cheerio'),
    $ = cheerio.load('<div id="context"></div>');

module.exports = {
    
    'DOM tryout': {
        
        beforeEach: function() {
            $('#context').append('<h1>test passes</h1>');
        },
        
        'Testing DOM': {
            
            'should render h1': function (done) {
                
                assert.deepEqual('test passes', $('h1').text());
                done();
            },
            
            'can add class': function (done) {
                
                $('h1').addClass('test');
                assert.ok('test', $('h1').hasClass('test'));

                done();
            }
        }
    }
    
};