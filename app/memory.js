const process = require('process');
const common = require('cpwcom');

const action = {
    init: function() {
        let arr = [],
            i = 0,
            p = {};


        let timer = setInterval(function() {

            p = process.memoryUsage();
            p.time = common.tools.formatDate(new Date());
            arr.push(p);
            i++;
            if (i > 100) {
                arr.shift();
            }
            common.file.reset('demo/memoryLog.json', JSON.stringify(arr, null, '  '));
            // if(i >=100){
            //
            //    // common.log.set('memoryLog.json',JSON.stringify(arr, null, '  ') );
            //    clearInterval(timer);
            // }
            console.log(p.time)
        }, 1000);

    }
};
module.exports = action;
// action.init();
