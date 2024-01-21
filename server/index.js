const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
// const { Novu } = require("@novu/node");
// const novu = new Novu(<API_KEY>);
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:3000",
	},
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
	pending: {
		title: "pending",
		items: [
			{
				id: fetchID(),
				title: "Send the Figma file to Dima",
				comments: [],
			},
		],
	},
	ongoing: {
		title: "ongoing",
		items: [
			{
				id: fetchID(),
				title: "Review GitHub issues",
				comments: [
					{
						name: "David",
						text: "Ensure you review before merging",
						id: fetchID(),
					},
				],
			},
		],
	},
	completed: {
		title: "completed",
		items: [
			{
				id: fetchID(),
				title: "Create technical contents",
				comments: [
					{
						name: "Dima",
						text: "Make sure you check the requirements",
						id: fetchID(),
					},
				],
			},
		],
	},
};

// const sendNotification = async (user) => {
// 	try {
// 		const result = await novu.trigger("<TEMPLATE_ID>", {
// 			to: {
// 				subscriberId: "<SUBSCRIBER_ID>",
// 			},
// 			payload: {
// 				userId: user,
// 			},
// 		});
// 		console.log(result);
// 	} catch (err) {
// 		console.error("Error >>>>", { err });
// 	}
// };
socketIO.on("connection", (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on("createTask", (data) => {
		const newTask = { id: fetchID(), title: data.task, comments: [] };
		tasks["pending"].items.push(newTask);
		socket.emit("tasks", tasks);

		// 👇🏻 sends notification via Novu
		// sendNotification(data.userId);
	});

	socket.on("taskDragged", (data) => {
		const { source, destination } = data;
        /*
        This code creates a shallow copy of the item being dragged (itemMoved). It uses the spread operator (...) to create a new object with the same properties as the dragged item */
		const itemMoved = {
			...tasks[source.droppableId].items[source.index],
		};
		console.log("ItemMoved>>> ", itemMoved);

        /*This line removes the dragged item from its original position within the source list. It uses splice() to modify the array in place. The first argument (source.index) is the index from which to start changing the array, and the second argument (1) indicates how many elements to remove*/
		tasks[source.droppableId].items.splice(source.index, 1);

        /*
        This line inserts the dragged item into its new position within the destination list. It uses splice() again, starting at the destination.index and inserting the itemMoved object into the array. The third argument (0) specifies that no elements should be removed at the insertion point.*/
		tasks[destination.droppableId].items.splice(
			destination.index,
			0,
			itemMoved
		);
		console.log("Source >>>", tasks[source.droppableId].items);
		console.log("Destination >>>", tasks[destination.droppableId].items);
		socket.emit("tasks", tasks);
	});

	socket.on("fetchComments", (data) => {
		const taskItems = tasks[data.category].items;
		for (let i = 0; i < taskItems.length; i++) {
			if (taskItems[i].id === data.id) {
				socket.emit("comments", taskItems[i].comments);
			}
		}
	});
	socket.on("addComment", (data) => {
		const taskItems = tasks[data.category].items;
		for (let i = 0; i < taskItems.length; i++) {
			if (taskItems[i].id === data.id) {
				taskItems[i].comments.push({
					name: data.userId,
					text: data.comment,
					id: fetchID(),
				});
				socket.emit("comments", taskItems[i].comments);
			}
		}
	});
	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("🔥: A user disconnected");
	});
});

app.get("/api", (req, res) => {
	res.json(tasks);
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

/*
http: This likely refers to an instance of an HTTP server created using a framework or library like Express.js. This server is an object with methods for handling HTTP requests.

.listen(PORT, callback): This method binds and listens for connections on the specified network address (in this case, it's listening on the specified PORT). It starts the server, and the provided callback function is executed once the server is listening and ready to handle requests.

PORT: This is a variable (constant) that holds the port number on which the server will listen for incoming requests. For example, if PORT is set to 3000, the server will listen on port 3000.

() => { console.log(Server listening on ${PORT}); }: This is the callback function that gets executed once the server is successfully listening. In this case, it logs a message to the console indicating that the server is listening on the specified port.*/