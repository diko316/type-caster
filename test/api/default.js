'use strict';

describe('TYPE([type_name:string]) or TYPE["default"]([type_name:string]) test',
    function (){
        
        var TYPE = use('index.js'),
            SUBJECT = TYPE('default');
        
        
        it('should return an instance a TYPE based from defined [type]',
            function () {
                should(TYPE.is(SUBJECT), 'be an instanceof TYPE');
            });
        
        
    });