'use strict';


describe('TYPE.has([type_name:string]) test',
    function (){
        
        var TYPE = use('index.js');
        
        
        it('should return true if type is defined',
            function () {
                should(
                    TYPE.has('test') === true,
                    'type_name exists and must return true');
            });
        
        it('should return false if type is not defined',
            function () {
                should(
                    TYPE.has('buang') === false,
                    'undefined type_name must not exist ' +
                        'and must return false');
            });
        
        
    });