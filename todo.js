let action = '', text = '';
if(process.argv[2])
	action = process.argv[2];
if(process.argv[3])
	text = process.argv[3];

usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

const fs = require('fs');

let getToDoList = function() {
	try {
		return JSON.parse(fs.readFileSync('todo.txt'));
	} catch(error) {
		return [];
	}
}

let writeTextFile = function(filename,data) {
	fs.writeFileSync(filename,JSON.stringify(data));
}

let appendTextFile = function(filename,data) {
	fs.appendFileSync(filename,data);
}

let getReport = function() {
	try {
		return JSON.parse(fs.readFileSync('report.txt'));
	} catch (error) {
		return {'pending':0,'completed':0};
	}
}

let getTodayDate = function() {
	let today = new Date();
	let todayDate = String(today.getFullYear())+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
	return todayDate;
}

let add = function() {
	if(text=='')
	{
		console.log('Error: Missing todo string. Nothing added!');
		return;
	}
	toDoList = getToDoList();
	toDoList.push(text);
	writeTextFile('todo.txt',toDoList);

	report = getReport();
	++report['pending'];
	writeTextFile('report.txt',report);

	let message = 'Added todo: "'+text+'"';
	console.log(message);
}

let ls = function() {
	toDoList = getToDoList();
	if(toDoList.length == 0)
		console.log('There are no pending todos!');
	else
	{
		let num = toDoList.length
		for(let i=toDoList.length-1;i>-1;--i)
		{
			console.log('['+num+'] '+toDoList[i]);
			--num;
		}
	}
}

let del = function() {
	if(text=='')
	{
		console.log('Error: Missing NUMBER for deleting todo.');
		return;
	}
	toDoList = getToDoList('todo.txt');
	if(toDoList.length == 0 || Number(text)<1 || Number(text)>toDoList.length)
		console.log('Error: todo #'+text+' does not exist. Nothing deleted.');
	else
	{
		toDoList.splice(Number(text)-1,1);
		writeTextFile('todo.txt',toDoList);
		report = getReport();
		--report['pending'];
		writeTextFile('report.txt',report);
		let message = 'Deleted todo #' + text;
		console.log(message);
	}
}

let done = function() {
	if(text=='')
	{
		console.log('Error: Missing NUMBER for marking todo as done.');
		return;
	}
	toDoList = getToDoList();
	if(toDoList.length == 0 || Number(text)<1 || Number(text)>toDoList.length)
		console.log('Error: todo #'+text+' does not exist.');
	else
	{
		let doneItem = toDoList[Number(text)-1];
		toDoList.splice(Number(text)-1,1);
		writeTextFile('todo.txt',toDoList);
		report = getReport();
		--report['pending'];
		++report['completed'];
		writeTextFile('report.txt',report);
		appendTextFile('done.txt','x '+getTodayDate()+' '+doneItem+'\n');
		let message = 'Marked todo #'+text+' as done.';
		console.log(message);
	}
}

let report = function() {
	report = getReport();
	console.log(getTodayDate()+' Pending : '+report['pending']+' Completed : '+report['completed']);
}

switch(action) {
	case '' : 
		console.log(usage);
		break;
	case 'help' : 
		console.log(usage);
		break;
	case 'add' : 
		add();
		break;
	case 'ls' :
		ls(); 
		break;
	case 'del' :
		del(); 
		break;
	case 'done' :
		done(); 
		break;
	case 'report' :
		report(); 
		break;
	default : 
		console.log("Invalid command args");
		break; 
}
