import { useEffect , useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

const Home = ( isAuth ) => {
const [postLists, setPostLists] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [sortOrder, setSortOrder] = useState("newest");
const postsCollectionRef = collection(db, "posts");

const getPosts = async () => {
    try {
        let data;
        if (sortOrder === "newest") {
            const q = query(postsCollectionRef, orderBy("createdAt", "desc"));
            data = await getDocs(q);
        } else if (sortOrder === "mostLikes") {
            const q = query(postsCollectionRef, orderBy("upvotes", "desc"));
            data = await getDocs(q);
        }
        setPostLists(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    } catch (err) {
        console.log(err);
    }
};

useEffect(() => {
    getPosts();
}, [sortOrder]);

function timeAgo(date) {
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;
    if(secondsPast < 60){
        return parseInt(secondsPast) + ' seconds ago';
    }
    if(secondsPast < 3600){
        return parseInt(secondsPast/60) + ' minutes ago';
    }
    if(secondsPast <= 86400){
        return parseInt(secondsPast/3600) + ' hours ago';
    }
    if(secondsPast > 86400){
        let day = date.getDate();
        let month = date.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        let year = date.getFullYear() == now.getFullYear() ? "" :  " "+date.getFullYear();
        return day + " " + month + year;
    }
}
   
    return (
        <div className="homePage">
            <div className="searchAndSort">
                <input
                    className="searchBar"
                    type="text"
                    placeholder="Search for a post..."
                    onChange={(event) => setSearchTerm(event.target.value.toLowerCase())}
                />
                <div className="sortOptions">
                    <p>Sort by: </p>
                    <button className="sort-btn" onClick={() => setSortOrder("newest")}>New Post</button>
                    <button className="sort-btn" onClick={() => setSortOrder("mostLikes")}>Most Likes</button>
                </div>
            </div>
    
            <div className="postsGrid">
                {postLists.filter((post) => {
                    return searchTerm === "" || post.title.toLowerCase().includes(searchTerm);
                }).map((post) => {
                    const MAX_LENGTH = 100; // Set a max length for post preview
    
                    return (
                        <div className="post" key={post.id}>
                            <div className="postHeader">
                                <h1>{post.title}</h1>
                                <p>Posted on: {post.createdAt ? timeAgo(post.createdAt.toDate()) : "unknown time"}</p>
                            </div>
                            <div className="postTextContainer">
                                {post.post.length > MAX_LENGTH 
                                    ? <div dangerouslySetInnerHTML={{ __html: `${post.post.substring(0, MAX_LENGTH)}...` }}></div>
                                    : <div dangerouslySetInnerHTML={{ __html: post.post }}></div>}
                                <Link to={`/post/${post.id}`} className="readMoreLink"><strong>Click to read more</strong></Link>
                            </div>
                            <p className="light-txt">Total Likes: <strong>{post.upvotes}</strong></p>
                        </div>
                    );
                })}
            </div>
        </div>
    ); 
}

export default Home;
