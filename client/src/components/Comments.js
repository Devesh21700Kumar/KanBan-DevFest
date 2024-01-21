import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const Comments = () => {
	const { category, id } = useParams();
	const [comment, setComment] = useState("");
	const [commentList, setCommentList] = useState([{
        pending: {
            title: "pending",
            items: [
                {
                    id: Math.random().toString(36).substring(2, 10),
                    title: "Send the Figma file to Dima",
                    comments: [],
                },
            ],
        },
        ongoing: {
            title: "ongoing",
            items: [
                {
                    id: Math.random().toString(36).substring(2, 10),
                    title: "Review GitHub issues",
                    comments: [
                        {
                            name: "David",
                            text: "Ensure you review before merging",
                            id: Math.random().toString(36).substring(2, 10),
                        },
                    ],
                },
            ],
        },
        completed: {
            title: "completed",
            items: [
                {
                    id: Math.random().toString(36).substring(2, 10),
                    title: "Create technical contents",
                    comments: [
                        {
                            name: "Dima",
                            text: "Make sure you check the requirements",
                            id: Math.random().toString(36).substring(2, 10),
                        },
                    ],
                },
            ],
        },
    }]);

	const addComment = (e) => {
		e.preventDefault();
		setComment("");
	};

	return (
		<div className='comments__container'>
			<form className='comment__form' onSubmit={addComment}>
				<label htmlFor='comment'>Add a comment</label>
				<textarea
					placeholder='Type your comment...'
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					rows={5}
					id='comment'
					name='comment'
					required
				></textarea>
				<button className='commentBtn'>ADD COMMENT</button>
			</form>
			<div className='comments__section'>
				<h2>Existing Comments</h2>
				{commentList.map((comment) => (
					<div key={comment.id}>
						<p>
							<span style={{ fontWeight: "bold" }}>{comment.text} </span>by{" "}
							{comment.name}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Comments;