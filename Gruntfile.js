module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'tblain69@gmail.com',
                password: 'Turututu69',
                branch: 'dev1',
                ptr: false
            },
            dist: {
                src: ['*.js']
            }
        }
    });
}