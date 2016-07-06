'use strict';


describe('TYPE.list() test',
    function (){
        
        var TYPE = use('index.js');
        
        it('should return Array list of defined type string',
            function () {
                should(TYPE.list() instanceof Array,
                    'be an instance of array');
            });
        
        it('should contain "test" previously defined TYPE',
            function () {
                should(TYPE.list().indexOf("test") !== -1,
                    'contain "test" defined TYPE');
            });
       
        
    });