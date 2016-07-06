'use strict';


describe('TYPE.is([instance:Type|Mixed]) test',
    function (){
        
        var TYPE = use('index.js');
        
        
        it('should return true if [intance] is instance of Type class',
            function () {
                should(
                    TYPE.is(TYPE('default')) === true,
                    'return true when [instance] is an instance of Type');
            });
        
        it('should return false if [intance] is not an instance of Type class',
            function () {
                should(
                    TYPE.is('buang') === false,
                    'return false when [instance] is not an instance of Type');
            });
        
        
    });