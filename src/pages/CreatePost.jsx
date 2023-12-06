import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = ( isAuth ) => {
    const [title, setTitle] = useState("");
    const [post, setPost] = useState("");
    const postsCollectionRef = collection(db, "posts");

    let navigate = useNavigate();

    const createPost = async () => {
        await addDoc(postsCollectionRef, {
            title: title,
            post: post,
            author: {name: auth.currentUser.displayName, id: auth.currentUser.uid},
            upvotes: 0,
            likes: [],
            createdAt: serverTimestamp(),
        });
        navigate("/");
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    });

    return (
        <div className="createPostPage">
            <img src="../src/assets/illustration-hero.gif" alt="decorative" />
            <div className="cpContainer">
                <h1>Create Post</h1>
                <div className="inputGp">
                    <label>Title</label>
                    <input
                        placeholder="Title..."
                        onChange={(event) => {
                            setTitle(event.target.value);}}
                    />
                </div>
                <div className="inputGp">
                    <label>Post</label>
                    <ReactQuill
                        placeholder="Write your post here..."
                        onChange={(content, delta, source, editor) => {
                            setPost(editor.getHTML());
                            }}
                    />
                </div>
                <button onClick={createPost}> Submit post</button>
            </div>
        </div>
    );
    }

    export default CreatePost;
