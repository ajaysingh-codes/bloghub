import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase-config';
import { doc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

const API_KEY = import.meta.env.VITE_API_KEY;

const PostDetail = ( {isAuth} ) => {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [sentiment, setSentiment] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            const postDocRef = doc(db, "posts", postId);
            const postDoc = await getDoc(postDocRef);
            if (postDoc.exists()) {
                setPost({ ...postDoc.data(), id: postDoc.id }); 
            } else {
                console.log("No such post!");
            }
        };

        fetchPost();
    }, [postId]);

    const upvotePost = async () => {
        if (!isAuth) {
            navigate("/login");
            return;
        }

        const postRef = doc(db, "posts", postId);

        // Check if user has already liked the post
        if (post.likes && post.likes.includes(auth.currentUser.uid)) {
            return;
        }

        await updateDoc(postRef, {
            upvotes: increment(1),
            likes: [...(post.likes || []), auth.currentUser.uid], // Add user to likes array
        });

        const updatedPost = await getDoc(postRef);
        setPost({ ...updatedPost.data(), id: updatedPost.id });
    };

    if(!post) {
        return <h1>Loading...</h1>
    }

    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id)
        await deleteDoc(postDoc);
        navigate("/");
    };

    async function classifyBlog(postContent, postId){
        const APIBody = {
            "model": "text-davinci-003",
            "prompt": "Classify this blog post as positive, neutral or negative: \n" + postContent,
            "temperature": 0,
            "max_tokens": 256,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
        };

        await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify(APIBody)
        }).then((response) => response.json()).then((data) => {

            const sentimentResult = data.choices[0].text.trim().toLowerCase();
            setSentiment(prevState => ({...prevState, [postId]: sentimentResult}));
        });
    }

    const getSentimentColor = (sentimentValue) => {
        switch(sentimentValue) {
            case "positive":
                return "green";
            case "neutral":
                return "orange";
            case "negative":
                return "red";
            default:
                return "black";
        }
    }
    
    return (
        <div className="postDetail">
            <p>Posted {post.createdAt.toDate().toLocaleDateString()}</p>
            <div className="deletePost">
                {isAuth && auth.currentUser && post.author.id === auth.currentUser.uid && (
                <button onClick={() => {
                    deletePost(post.id);
                }}>Delete</button>
            )}
            </div>
            <h1>{post.title}</h1>
            <div className="postDetailHeader">
                <p><strong>Posted by {post.author.name}</strong></p>
                
            </div>
            <div className="postDetailBody">
                <p dangerouslySetInnerHTML={{ __html: post.post }} />
            </div>
            <button 
                className="btn" 
                onClick={upvotePost}
                disabled={post.likes && post.likes.includes(auth.currentUser.uid)}>Like 👍</button>
            <button className="ai-btn" onClick={() => classifyBlog(post.post, post.id)}>Classify using AI</button>
            { sentiment[post.id] !== undefined && (
                <div> 
                    <p style={{ color: getSentimentColor(sentiment[post.id]) }}>
                        According to AI, this blog is: {sentiment[post.id]}
                    </p>
                </div>
            )}    
        </div>
    )
}

export default PostDetail