import React from "react";
import AddTask from "./AddTask";
import TasksContainer from "./TasksContainer";
import Nav from "./Nav";


const Task = () => {
	return (
		<div>
			<Nav />
			<AddTask />
			<TasksContainer />
		</div>
	);
};

export default Task;