'use strict';


describe('TYPE.define([type_name], [config:object|Type]) test',
    function (){
        
        var TYPE = use('index.js');
        
        
        it('should define TYPE with [type_name:string] and ' +
            '[config:object] parameters',
            function () {
                var returned = false;
                try {
                    returned = TYPE.define('test', {
                                cast: function (data) {
                                    return 'test';
                                }
                            });
                }
                catch (e) {}
                
                should(returned === TYPE,
                       'return TYPE "default" for chaining calls');
                
                should(TYPE.has('test') === true,
                       'already be defined and has() should return true');
                
            });
        
        it('should define TYPE with [type_name:string] and ' +
            '[config:Type] parameters',
            function () {
                var returned = false;
                try {
                    returned = TYPE.define('test2', TYPE('test'));
                }
                catch (e) {}
                
                should(returned === TYPE,
                       'return TYPE "default" for chaining calls');
                
                should(TYPE.has('test2') === true,
                       'already be defined and has() should return true');
                
            });

    });
