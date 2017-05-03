/**
 * Created by cpw on 13/04/2017.
 */
require([
    "jquery",
    "confirmbox", //非模块
    root.css+"/static/css/root",
    root.css+"/static/confirmbox/confirmbox"
],function($){
    var  myChart = echarts.init(document.getElementById('memory'));
    $(document).ready(function() {
        var root = {
            init: function() {
                // this.doAjax("memoryLog");
                this.onEvent();
                this.initChart();
            },
            onEvent:function(){
                this.onHelp();
            },
            /* 异步获取本地动态生成的ip地址，用于手机端即时访问
             * return {object Object} 将ip.json获取后直接用于使用
             */
            doAjax: function(fileName) {
                var _this = this;
                jQuery.ajax({
                    type: "GET",
                    url: fileName + ".json",
                    dataType: "json",
                    success: function(data) {
                        // _this.creatDOM(data);

                        _this.resetChart(data);
                    },
                    error: function(err) {
                        console.log(err.responseText);
                    }
                });
            },
            initChart:function(){
                var _this=this;
                // this.resetChart([]);
                var option = {
                    title: {
                        text: '内存实时监测'
                    },
                    tooltip: {
                        trigger: 'axis',

                        axisPointer: {
                            animation: true
                        }
                    },
                    legend: {
                        data:['rss','heapUsed','heapTotal']
                    },
                    xAxis: {
                         // type: 'time',
                        data: [],
                        splitLine: {
                            show: false
                        }
                    },
                    // dataZoom: [
                    //     {
                    //         show: true,
                    //         realtime: true,
                    //         start: 65,
                    //         end: 85
                    //     },
                    //     {
                    //         type: 'inside',
                    //         realtime: true,
                    //         start: 65,
                    //         end: 85
                    //     }
                    // ],
                    yAxis: {},
                    series: [{
                        name: 'rss',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: []
                    },{
                        name: 'heapUsed',
                        type: 'line',
                        data: []
                    },{
                        name: 'heapTotal',
                        type: 'bar',
                        data: []
                    }]
                };
                myChart.setOption(option);
                var timer = setInterval(function(){
                    _this.doAjax('../memoryLog');
                },1000);
                // setTimeout(function(){
                //
                // },1000);
            },
            resetChart:function(data){
                var _this=this;
                var result =  this.formatData(data);
                var option = {
                    xAxis: {
                        data: result.xArray,
                        splitLine: {
                            show: false
                        }
                    } ,
                    series: [{
                        name: 'rss',
                        type: 'line',
                        showSymbol: false,
                        hoverAnimation: false,
                        data: result.rssArray
                    },{
                        name: 'heapUsed',
                        type: 'line',
                        data: result.heapUsed
                    },{
                        name: 'heapTotal',
                        type: 'bar',
                        data: result.heapTotal
                    }]
                };
                myChart.setOption(option);

            },

            formatData:function(data){
                var result={
                    rssArray:[],
                    xArray:[],
                    heapUsed:[],
                    heapTotal:[]
                };
                for(var i of data){
                    result.rssArray.push(i.rss);
                    result.xArray.push(i.time);
                    result.heapUsed.push(i.heapUsed);
                    result.heapTotal.push(i.heapTotal);
                }
                return result;
            },
            /*
             * 右上角菜单
             */
            onHelp:function(){
                $(".J-about").on("click",function(e){
                    confirmBox({
                        head:"About",
                        msgTitle:"作者声明",
                        msgContent:"本工具开源，如要修改或二次开发请告知作者,以便于更好的维护此工具。Thanks!",
                        confirmBtn:"知道了",
                        cancelBtnSwitch:false,
                        headSwitch:false

                    });
                });
            }

        };
        root.init();

    })

});
