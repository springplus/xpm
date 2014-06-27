/**
 * Created by hongxq on 2014/6/27.
 */
module.exports = function (grunt) {
    require('time-grunt')(grunt);//Grunt处理任务进度条提示

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            xgee: {
                src: ['m/xgee/**/*.js'],
                dest: 'build/js/xgee.js'
            },
            project: {
                src: ['m/project/**/*.js'],
                dest: 'build/js/project.js'
            },
            sys: {
                src: ['m/sys/**/*.js'],
                dest: 'build/js/sys.js'
            },
            metadata: {
                src: ['m/metadata/**/*.js'],
                dest: 'build/js/metadata.js'
            },
            issue: {
                src: ['m/issue/**/*.js'],
                dest: 'build/js/issue.js'
            }

        },

        //监听变化 默认grunt watch 监测所有开发文件变化
        watch: {
            options: {
                //开启 livereload
                livereload: true,
                //显示日志
                dateFormate: function (time) {
                    grunt.log.writeln('[watch started]' + time + 'ms ' + (new Date()).toString());
                    grunt.log.writeln('[listening]\r\n');
                }
            },
            js: {
                files: 'm/**/*.js',
                tasks: ['concat']
            }

        }
    })


//    grunt.event.on('watch', function(action, filepath, target) {
//        grunt.log.writeln(">>>[watch]文件状态变更["+action+"]>>>"+target + ': '+filepath);
//    });


    // 载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
//    grunt.loadNpmTasks('grunt-contrib-clean');
//    grunt.loadNpmTasks('grunt-contrib-compress');
//    grunt.loadNpmTasks('grunt-contrib-copy');
//    grunt.loadNpmTasks('grunt-contrib-cssmin');
//    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 注册任务
    grunt.registerTask('default', ['concat','watch']);

};
