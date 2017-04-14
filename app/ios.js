'use strict';

const inquirer = require('inquirer');


const list =[{
	type:'list',
	name:'iphone',
	message:'choose a iphone',
	choices:[
		'iPhone 5 (10.3) [A079795B-6C98-4C9E-88E4-AC3ABE2EF046]' ,
		'iPhone SE (10.3) [BBD0022B-1A4A-4AD7-917E-94410DA20A05]',
		'iPhone 6s (10.3) [5B302707-7A5F-429D-95C5-EFC2E0457753]',
		'iPhone 6 Plus (10.3) [193BDCED-486B-489D-9B86-FE971420A7AD]',
		'iPhone 7 (10.3) [485D9301-19E4-4868-B859-A673AD13017B]',
		'iPhone 7 Plus (10.3) [6245386C-6950-4610-A365-EB77C9BCF427]'
	],
	filter:function(val){
		return val;
	}
}];

const action ={
	getchoose:function(callback){
		inquirer.prompt(list).then(function (answers) {
		  callback(answers);
		});
	}
};

// action.getchoose(function(answers){
// 	// console.log(answers);
// 	//  const iphone = answers.iphone;
// 	//  shell.task('xcrun instruments -w "'+iphone+'"');
// 	// shell.task('node path')
//
// });
module.exports = action;
