/*
* 日志种类封装
*/

const colors = [31,32,33,34,35,36];

const msg ={
	error:(text)=>{
		console.log('\033[31m'+text+'\033[m');
	},
	log:(text)=>{
		console.log('\033[31m'+text+'\033[m');
	},
    warn:(text)=>{
        console.log('\033[31m'+text+'\033[m');
    },
	tip:(text)=>{
		console.log('\033[31m'+text+'\033[m');
	},
	info:(text)=>{
		console.log('\033[31m'+text+'\033[m');
	}
};

module.exports = msg;
