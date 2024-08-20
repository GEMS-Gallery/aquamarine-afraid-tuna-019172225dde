import Func "mo:base/Func";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import List "mo:base/List";
import Time "mo:base/Time";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variables for storing posts and the next post ID
  stable var posts : [Post] = [];
  stable var nextPostId : Nat = 0;

  // Function to create a new post
  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextPostId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextPostId += 1;
    nextPostId - 1
  };

  // Function to get all posts, sorted by timestamp (most recent first)
  public query func getPosts() : async [Post] {
    Array.sort(posts, func(a: Post, b: Post) : { #less; #equal; #greater } {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };
}
