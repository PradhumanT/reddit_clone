const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid")
const cors = require('cors');


// const { nanoid } = require('nanoid');
const app = express();


// APP Stuff
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


// MONGOOSE STUFF
const con = mongoose.connection
mongoose.connect('mongodb+srv://Dass_Data:1234@cluster0.weu4u3b.mongodb.net/?retryWrites=true&w=majority')
con.on('open', function () {
    console.log("Connnected ..")
})

// DEFINING SCHEMA
const userschema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    Email: { type: String, unique: true },
    Contactno: { type: String, unique: true },
    Age: Number,
    Password: String,
    numfollowing: { type: Number, default: 0 },
    numfollowers: { type: Number, default: 0 },
    Followers: {
        type: [{
            firstname: String,
            lastname: String,
            fusername: { type: String },
        }], sparse: true
    },
    Following: {
        type: [{
            firstname: String,
            lastname: String,
            fusername: { type: String },
        }], sparse: true
    }
});

const subgredditschema = new mongoose.Schema({
    PageId: { type: String, unique: true },
    Moderator: { type: String },
    Name: String, // Name of Subreddit Page
    Description: String,
    Banned_keywords: String,
    Tags: String,
    numfollowers: Number,
    Followers: {
        type: [{
            mfirstname: String,
            mlastname: String,
            musername: String,
            joiningdate: { type: Date },
            blocked: Boolean,
        }], sparse: true
    },
    numposts: Number,
    numvisitors: Number,
    PendingRequest: {
        type: [{
            pfirstname: String,
            plastname: String,
            pusername: String,
        }], sparse: true
    },
    numdeletedposts: Number,
    numreportedposts: Number,
    Reporters: {
        type: [{
            reportid: String,
        }], sparse: true
    },

}, { timestamps: true })


const visitorschema = new mongoose.Schema({
    PageId: String,
    Count: Number,
    Date: String,
}, { unique: true })

const reportschema = new mongoose.Schema({
    ReportId: { type: String, unique: true },
    Reportedby: String, // username of the person who reported
    whomreported: String, // pageid of the subgreddit page reported
    concern: String,
    Postid: String, // to get text of post
    Status: String, // ignored / blocked / reported / notselected
    createdAt: { type: Date, default: Date.now },
    // expire_at: { type: Date, default: new Date(Date.now() + 60) }, // expire after 1 minute of non-activity , further do myDocument.expire_at = null to remove expiry
})
reportschema.index({ createdAt: 1 }, { expireAfterSeconds: 30 });

const postschema = new mongoose.Schema({
    PostId: { type: String, unique: true },
    Postedby: String, // username of the person who posted,
    PostedIn: String, // pageid of the subgreddit page posted in,
    Title: String,
    Text: String,

    Upvotes: Number,
    Downvotes: Number,
}, { timestamps: true })

const postcomment = new mongoose.Schema({
    PostId: String,
    Commentedby: String, // username of the person who commented,
    Comment: String,
})

const bannedfromsubgreddit = new mongoose.Schema({
    PageId: String,
    Userbanned: String,
})

const blockedfromsubgreddit = new mongoose.Schema({
    PageId: String,
    Userblocked: String,
})

const savedposts = new mongoose.Schema({
    PostId: String,
    User: String,
})

const User = mongoose.model('User', userschema);
const Subgreddit = mongoose.model('Subgreddit', subgredditschema);
const Report = mongoose.model('Report', reportschema);
const Post = mongoose.model('Post', postschema);
const PostComment = mongoose.model('PostComment', postcomment);
const BannedFromSubgreddit = mongoose.model('BannedFromSubgreddit', bannedfromsubgreddit);
const BlockedFromSubgreddit = mongoose.model('BlockedFromSubgreddit', blockedfromsubgreddit);
const SavedPosts = mongoose.model('SavedPosts', savedposts);
const Visitor = mongoose.model('Visitor', visitorschema);

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/api/signup', (req, res) => {
    res.json({ message: 'Welcome to Signup Backend Api' });
});

app.post('/api/signup', async (req, res) => {
    var password = req.body.password;

    // encrypt password
    var salt = await bcrypt.genSaltSync(10);
    var encryptedpassword = await bcrypt.hashSync(password, salt);

    if (req.body.firstname == "" || req.body.lastname == "" || req.body.username == "" || req.body.email == "" || req.body.contactno == "" || req.body.age == "" || req.body.password == "") {
        res.status(400).json({ error: "Please fill all the fields" });
        return;
    }

    var emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!req.body.email.match(emailregex)) {
        res.status(400).json({ error: "Please Enter Valid Email" });
        return;
    }

    var phoneno = /^[6789]\d{9}$/;
    if (!req.body.contactno.match(phoneno)) {
        res.status(400).json({ error: "Please Enter Valid Phone Number" });
        return;
    }
    // var truth = bcrypt.compareSync(password, hash); // To Check Password
    data = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "username": req.body.username,
        "Email": req.body.email,
        "Contactno": req.body.contactno,
        "Age": req.body.age,
        "Password": encryptedpassword,
        "numfollowers": 0,
        "numfollowing": 0,
    }
    const user = new User(data);
    await user.save()
    res.json({ message: "hi baby" });
});

app.get('/api/login', (req, res) => {
    res.json({ message: 'Welcome to Login Backend Api' });
});

app.post('/api/login', async (req, res) => {

    var password = req.body.password;
    var username = req.body.username

    const tempuser = await User.find({ username: username })
    if (!tempuser.length) // user not found
        res.status(400).json({ success: false, error: "User Not Found" })
    else {
        // console.log(tempuser[0])
        var truth = await bcrypt.compareSync(password, tempuser[0].Password); // To Check Password
        // console.log(tempuser[0])
        if (!truth)
            res.status(400).json({ success: false, error: "Incorrect Password" })
        else {
            let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');
            res.status(200).json({ success: true, token: token });
        }
    }
});

app.post('/api/updatedetails', async (req, res) => {
    // console.log(req.body.newdata)

    const tempuser = await User.find({ _id: req.body.newdata.id })
    // console.log(tempuser, req.body.password)
    var truth = bcrypt.compareSync(req.body.password, tempuser[0].Password);

    if (!truth) {
        res.status(400).json({ success: false, error: "Incorrect Password" })
    }
    else {


        tempuser[0].firstname = req.body.newdata.firstname;
        tempuser[0].lastname = req.body.newdata.lastname;
        tempuser[0].username = req.body.newdata.username;
        tempuser[0].Email = req.body.newdata.email;
        tempuser[0].Contactno = req.body.newdata.contactno;
        tempuser[0].Age = req.body.newdata.age;

        // console.log(tempuser[0])

        await tempuser[0].save();


        let token = jwt.sign({ id: req.body.newdata.id, firstname: req.body.newdata.firstname, lastname: req.body.newdata.lastname, username: req.body.newdata.username, email: req.body.newdata.email, contactno: req.body.newdata.contactno, age: req.body.newdata.age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

        // console.log(resp)

        res.status(200).json({ success: true, token: token });
    }
})

app.post("/api/getfollowers", async (req, res) => {
    let username = req.body.username;
    const tempuser = await User.find({ username: username })

    if (!tempuser.length) // user not found
        res.status(400).json({ success: false, error: "User Not Found" })
    else {
        res.status(200).json(tempuser[0].Followers);
    }
})
app.post("/api/getfollowing", async (req, res) => {
    let username = req.body.username;
    const tempuser = await User.find({ username: username })

    if (!tempuser.length) // user not found
        res.status(400).json({ success: false, error: "User Not Found" })
    else {
        res.status(200).json(tempuser[0].Following);
    }
})

app.post("/api/removefollower", async (req, res) => {
    let followee = req.body.followee;
    let follower = req.body.follower;

    // console.log(followee, follower)

    let tempuser = await User.find({ username: followee })

    for (var i = 0; i < tempuser[0].Followers.length; i++) {
        if (tempuser[0].Followers[i].fusername === follower) {
            var spliced = tempuser[0].Followers.splice(i, 1);
            break;
        }
    }
    tempuser[0].numfollowers = tempuser[0].numfollowers - 1;
    await tempuser[0].save()

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    // Logic for removal from follower's following list 

    let tempuser1 = await User.find({ username: follower });
    for (var i = 0; i < tempuser1[0].Following.length; i++) {
        if (tempuser1[0].Following[i].fusername === followee) {
            var spliced = tempuser1[0].Following.splice(i, 1);
            break;
        }
    }
    tempuser1[0].numfollowing = tempuser1[0].numfollowing - 1;
    await tempuser1[0].save()

    res.status(200).json({ Usertoken: token, Follower: tempuser1[0].Following })

})

app.post("/api/removefollowing", async (req, res) => {
    let followee = req.body.followee;
    let following = req.body.following;


    let tempuser = await User.find({ username: followee })

    for (var i = 0; i < tempuser[0].Following.length; i++) {
        if (tempuser[0].Following[i].fusername === following) {
            var spliced = tempuser[0].Following.splice(i, 1);
            break;
        }
    }
    tempuser[0].numfollowing = tempuser[0].numfollowing - 1;
    await tempuser[0].save()

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    // Logic for removal from following's follower list pending !!
    let tempuser1 = await User.find({ username: following });
    for (var i = 0; i < tempuser1[0].Followers.length; i++) {
        if (tempuser1[0].Followers[i].fusername === followee) {
            var spliced = tempuser1[0].Followers.splice(i, 1);
            break;
        }
    }
    tempuser1[0].numfollowers = tempuser1[0].numfollowers - 1;
    await tempuser1[0].save()

    res.status(200).json({ Usertoken: token, Following: tempuser1[0].Followers })

})

app.post('/api/fetchprofile', async (req, res) => {
    let username = req.body.username;
    let tempuser = await User.find({ username: username })

    let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

    res.status(200).json({ token: token });
})

app.post('/api/follow', async (req, res) => {
    // console.log(req.body);
    let user = req.body.user;
    let whotofollow = req.body.whotofollow;

    let tempuser = await User.find({ username: user });
    let tempuser1 = await User.find({ username: whotofollow });

    if (tempuser[0].Following.filter((following) => { return following.fusername === whotofollow }).length > 0) {
        res.status(400).json({ error: "You already Follow this User !! " });
    }

    else if (tempuser1[0].Followers.filter((follower) => { return follower.fusername === user }).length > 0) {
        res.status(400).json({ error: "You already Follow this User !! " });
    }
    else {
        tempuser[0].Following.push({
            firstname: tempuser1[0].firstname,
            lastname: tempuser1[0].lastname,
            fusername: tempuser1[0].username
        })
        tempuser[0].numfollowing = tempuser[0].numfollowing + 1;

        tempuser1[0].Followers.push({
            firstname: tempuser[0].firstname,
            lastname: tempuser[0].lastname,
            fusername: tempuser[0].username
        })
        tempuser1[0].numfollowers = tempuser1[0].numfollowers + 1;

        // console.log(tempuser[0]);

        await tempuser[0].save();
        await tempuser1[0].save();

        let token = jwt.sign({ id: tempuser[0]._id, firstname: tempuser[0].firstname, lastname: tempuser[0].lastname, username: tempuser[0].username, email: tempuser[0].Email, contactno: tempuser[0].Contactno, age: tempuser[0].Age, numfollowers: tempuser[0].numfollowers, numfollowing: tempuser[0].numfollowing }, 'jwtsecret');

        res.status(200).json({ token: token });
    }
})

app.post('/api/createsubgreddit', async (req, res) => {
    let data = req.body;
    // console.log(data)
    pagedata = {
        "PageId": uuidv4(),
        "Moderator": req.body.moderator,
        "Name": req.body.name,
        "Description": req.body.description,
        "Banned_keywords": req.body.banned_keywords,
        "Tags": req.body.tags,
        "numfollowers": 1,
        "Followers": [{
            "mfirstname": req.body.modfname,
            "mlastname": req.body.modlname,
            "musername": req.body.moderator,
            "blocked": false
        }],
        "numposts": 0,
        "numvisitors": 0,
        "PendingRequest": [],
        "numdeletedposts": 0,
        "numreportedposts": 0,
        "Reporters": []
    }

    const page = new Subgreddit(pagedata);
    await page.save();

    // console.log(page)
    let token = jwt.sign({ page }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.post("/api/getmysubgreddits", async (req, res) => {
    let data = req.body;
    let mysubgredits = await Subgreddit.find({ Moderator: data.username })
    let token = jwt.sign({ mysubgredits }, 'jwtsecret');
    res.status(200).json({ token: token })
})

app.post("/api/createpost", async (req, res) => {
    let data = req.body;



    let pagedata = await Subgreddit.find({ PageId: data.pageid });
    pagedata[0].numposts = pagedata[0].numposts + 1;
    let bannedkeywords = pagedata[0].Banned_keywords;
    await pagedata[0].save();

    bannedkeywords = bannedkeywords.split(',');
    let text = data.text;

    let containsbanned = false;
    for (let i = 0; i < bannedkeywords.length; i++) {
        let regex = new RegExp(bannedkeywords[i].trim(), 'gi');
        if (text.match(regex))
            containsbanned = true;
        text = text.replace(regex, '****');
    }


    let postdata = {
        "PostId": uuidv4(),
        "PostedIn": data.pageid,
        "Postedby": data.postedby,
        "Title": data.title,
        "Text": text,
        "Upvotes": 0,
        "Downvotes": 0,
    }

    const post = new Post(postdata);
    await post.save();

    let token = jwt.sign({ post }, 'jwtsecret');
    res.status(200).json({ token: token, containsbanned: containsbanned });
})

app.post('/api/fetchposts', async (req, res) => {
    let data = req.body;
    let posts = await Post.find({ PostedIn: data.pageid });
    let subgreddit = await Subgreddit.find({ PageId: data.pageid });
    

    // PAGE WAS VISITED , SO VISITORS STAT ALSO
    const currentDate = new Date();
    subgreddit[0].numvisitors = subgreddit[0].numvisitors + 1;
    await subgreddit[0].save();

    let visitors = await Visitor.find({ PageId: data.pageid, Date: currentDate.toDateString() });
    if (visitors.length === 0) {
        let firstvisitor = new Visitor({
            PageId: data.pageid,
            Date: currentDate.toDateString(),
            Count: 1
        })

        await firstvisitor.save();
    }
    else {
        visitors[0].Count = visitors[0].Count + 1;
        await visitors[0].save();
    }


    // MAKING COMPLETE POSTS WITH COMMENTS AND Flagging Blocked Users
    let completeposts = [];

    await Promise.all(
        posts.map(async (post) => {  // .map function IGNORES ASYNC

            const promise = new Promise((resolve, reject) => {
                return PostComment.find({ PostId: post.PostId }, (err, comments) => {
                    if (err) reject(err);
                    resolve(comments);
                });
            });
            
            const promise2 = new Promise((resolve, reject) => {
                return BlockedFromSubgreddit.find({ PageId: data.pageid , Userblocked:post.Postedby }, (err, blocked) => {
                    if (err) reject(err);
                    resolve(blocked);
                });
            })

            const comments = await promise;
            const blocked = await promise2;
           
            completeposts.push({ ...post,userblocked : blocked.length>0 ? true :false ,comments: comments });
            return post;
        }));

        
    let token = jwt.sign({ posts: completeposts, moderator: subgreddit[0].Moderator, Name: subgreddit[0].Name, Description: subgreddit[0].Description }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.post('/api/fetchsubmembers', async (req, res) => {
    let data = req.body;
    // console.log(data)
    let subdata = await Subgreddit.find({ PageId: data.pageid });
    let blockedfollowers = await BlockedFromSubgreddit.find({ PageId: data.pageid })

    let followers = subdata[0].Followers;
    followers.forEach((follower) => {
        blockedfollowers.forEach((blocked) => {
            if (follower.musername === blocked.Userblocked) {
                follower.blocked = true;
            }
        })
    })

    let token = jwt.sign({ followers }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.post('/api/fetchjoiningreq', async (req, res) => {
    let data = req.body;
    let pagedata = await Subgreddit.find({ PageId: data.pageid });

    let requests = pagedata[0].PendingRequest;
    let token = jwt.sign({ requests:requests , pagemod:pagedata.Moderator }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.post('/api/acceptjoiningreq', async (req, res) => {
    let data = req.body;
    let pagedata = await Subgreddit.find({ PageId: data.pageid });

    let requests = pagedata[0].PendingRequest;
    let followers = pagedata[0].Followers;

    let temp = requests.filter((request) => {
        return request.pusername === data.username;
    });

    followers.push({
        mfirstname: temp[0].pfirstname,
        mlastname: temp[0].plastname,
        musername: temp[0].pusername,
        joiningdate: Date.now(),
        blocked: false
    });

    pagedata[0].numfollowers = pagedata[0].numfollowers + 1;

    requests = requests.filter((request) => {
        return request.pusername !== data.username;
    });

    pagedata[0].PendingRequest = requests;
    await pagedata[0].save();

    let token = jwt.sign({ requests }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.post('/api/rejectjoiningreq', async (req, res) => {
    let data = req.body;
    let pagedata = await Subgreddit.find({ PageId: data.pageid });

    let requests = pagedata[0].PendingRequest;

    requests = requests.filter((request) => {
        return request.pusername !== data.username;
    });

    pagedata[0].PendingRequest = requests;
    await pagedata[0].save();

    let token = jwt.sign({ requests }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.get('/api/getallsubgreddits', async (req, res) => {
    let subgreddits = await Subgreddit.find({});
    // console.log(subgreddits);
    let token = jwt.sign({ subgreddits }, 'jwtsecret');

    res.status(200).json({ token: token });
})

app.post('/api/joinsubgreddit', async (req, res) => {
    let data = req.body;
    let pagedata = await Subgreddit.find({ PageId: data.pageid });
    let user = await User.find({ username: data.username });

    // Check if he is banned from page or not
    let bannedfollowers = await BannedFromSubgreddit.find({ PageId: data.pageid });

    // check if he is blocked from page or not
    let blockedfollowers = await BlockedFromSubgreddit.find({ PageId: data.pageid });

    if (bannedfollowers.filter((follower) => follower.Userbanned === data.username).length > 0) {
        // person is banned from following this page
        res.status(400).json({ error: "You are banned from this page" })
    }
    else if (blockedfollowers.filter((follower) => follower.Userblocked === data.username).length > 0) {
        res.status(400).json({ error: "You are blocked from this page for your report" })
    }
    else {

        let pendingrequests = pagedata[0].PendingRequest;
        pendingrequests.push({
            pfirstname: user[0].firstname,
            plastname: user[0].lastname,
            pusername: user[0].username
        });

        pagedata[0].PendingRequest = pendingrequests;
        await pagedata[0].save();
        res.status(200).json({ message: "Request Sent" });
    }
})

app.post('/api/leavepage', async (req, res) => {
    let data = req.body;
    let pagedata = await Subgreddit.find({ PageId: data.pageid });
    let followers = pagedata[0].Followers;
    followers = followers.filter((follower) => {
        return follower.musername !== data.username;
    });

    pagedata[0].Followers = followers;
    pagedata.numfollowers = pagedata.numfollowers - 1;
    await pagedata[0].save();

    // Ban person from ever joining again
    let newbanned = new BannedFromSubgreddit({
        PageId: data.pageid,
        Userbanned: data.username,
    })
    // console.log(newbanned);
    await newbanned.save();

    res.status(200).json({ message: "Left Page" });
})

app.post('/api/upvotepost', async (req, res) => {
    let data = req.body;
    let post = await Post.find({ PostId: data.postid });
    post[0].Upvotes = post[0].Upvotes + 1;
    await post[0].save();

    res.status(200).json({ message: "Upvoted" });
})

app.post('/api/downvotepost', async (req, res) => {
    let data = req.body;
    let post = await Post.find({ PostId: data.postid });
    post[0].Downvotes = post[0].Downvotes + 1;
    await post[0].save();

    res.status(200).json({ message: "Downvoted" });
})

app.post('/api/commentpost', async (req, res) => {
    let data = req.body;
    let postcomment = new PostComment({
        "PostId": data.postid,
        "Comment": data.comment,
        "Commentedby": data.username
    });

    await postcomment.save();

    res.status(200).json({ message: "Commented" });
})

app.post('/api/savepost', async (req, res) => {
    let data = req.body;
    let savedpost = new SavedPosts({
        "PostId": data.postid,
        "User": data.username,
    });

    await savedpost.save();

    res.status(200).json({ message: "Saved" });
})

app.post('/api/unsavepost', async (req, res) => {
    let data = req.body;
    await SavedPosts.deleteOne({
        "PostId": data.postid,
        "User": data.username,
    })

    res.status(200).json({ message: "Unsaved" });
})

app.post('/api/getsavedposts', async (req, res) => {
    let data = req.body;
    let savedposts = await SavedPosts.find({ User: data.username }); // it only contains postids


    // GET POSTS WITH COMMENTS
    let completeposts = [];
    await Promise.all(
        savedposts.map(async (post) => {  // .map function IGNORES ASYNC

            const promise = new Promise((resolve, reject) => {
                return PostComment.find({ PostId: post.PostId }, (err, comments) => {
                    if (err) reject(err);
                    resolve(comments);
                });
            });

            const promise2 = new Promise((resolve, reject) => {
                return Post.findOne({ PostId: post.PostId }, (err, comments) => {
                    if (err) reject(err);
                    resolve(comments);
                });
            });

            const comments = await promise;
            const postdata = await promise2;
            completeposts.push({ _doc: postdata, comments: comments });
            return post;
        }));

    // console.log(completeposts);

    let token = jwt.sign({ posts: completeposts }, 'jwtsecret');
    res.status(200).json({ token: token });
})

app.post('/api/getmemberstats', async (req, res) => {
    let data = req.body; // pageid = data.pageid

    const subgreddit = await Subgreddit.find({ PageId: data.pageid });

    const followers = subgreddit[0].Followers;

    // aggregate the followers array to get number of followers by day
    let countByJoiningDate = {};
    followers.map((follower) => {
        if (follower.joiningdate === undefined) return;
        let joiningDate = follower.joiningdate.toDateString();
        if (!countByJoiningDate[joiningDate]) {
            countByJoiningDate[joiningDate] = 0;
        }
        countByJoiningDate[joiningDate]++;
    })

    // get posts by date
    const posts = await Post.find({ PostedIn: data.pageid });
    let postsbycreationdate = {};
    posts.map((post) => {
        // console.log(post.createdAt.toDateString());
        let creationdate = post.createdAt.toDateString();
        if (!postsbycreationdate[creationdate]) {
            postsbycreationdate[creationdate] = 0;
        }
        postsbycreationdate[creationdate]++;
    })

    // get numvisitors by date
    const visitors = await Visitor.find({ Visited: data.pageid });
    let visitorsbydate = {};
    visitors.map((visitor) => {
        let date = visitor.Date;
        if (!visitorsbydate[date]) {
            visitorsbydate[date] = visitor.Count;
        }
    })

    // get numreports vs numdeleted posts
    let reportstat = { numreportedposts: subgreddit[0].numreportedposts, numdeletedposts: subgreddit[0].numdeletedposts };

    res.status(200).json({ countByJoiningDate: countByJoiningDate, postsbycreationdate: postsbycreationdate, visitorsbydate: visitorsbydate, reportstat: reportstat });
});

app.post('/api/reportpage', async (req, res) => {
    let data = req.body;

    const report = new Report({
        ReportId: uuidv4(),
        Reportedby: data.reportedby, // username of the person who reported
        whomreported: data.whomreported, // pageid of the subgreddit page reported
        concern: data.concern,
        Postid: data.postid, // to get text of post
        Status: null, // ignored / blocked / reported / notselected
    });

    await report.save();

    const subgreddit = await Subgreddit.findOne({ PageId: data.whomreported });
    subgreddit.numreportedposts = subgreddit.numreportedposts + 1;
    await subgreddit.save();

    res.status(200).json({ message: "Reported" });
});

app.post('/api/getreports', async (req, res) => {
    let data = req.body;
    const reports = await Report.find({ whomreported: data.pageid });
    // console.log("reports", reports);
    let completereports = [];
    await Promise.all(
        reports.map(async (report) => {  // .map function IGNORES ASYNC

            const promise = new Promise((resolve, reject) => {
                return Post.findOne({ PostId: report.Postid }, (err, post) => {
                    if (err) reject(err);
                    resolve(post);
                });
            });


            const promise2 = new Promise((resolve, reject) => {
                return Subgreddit.findOne({ PageId: report.whomreported }, (err, subgreddit) => {
                    if (err) reject(err);
                    resolve(subgreddit);
                });
            });

            const post = await promise;
            const subgreddit = await promise2;

            completereports.push({ ...report, posttext: post.Text, subgredditname: subgreddit.Name, subgredditmoderator: subgreddit.Moderator });
            return report;
        }));

    let token = jwt.sign({ reports: completereports }, 'jwtsecret');
    res.status(200).json({ token: token });
});

app.post('/api/ignorereport', async (req, res) => {
    let data = req.body;
    let report = await Report.findOne({ ReportId: data.reportid });
    report.Status = "ignored";
    report.createdAt = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)); // set to 1 year from now

    await report.save();

    res.status(200).json({ message: "Report Ignored" });
});

app.post('/api/blockreport', async (req, res) => {
    let data = req.body;
    let report = await Report.findOne({ ReportId: data.reportid });
    report.Status = "blocked";
    report.createdAt = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)); // set to 1000 years from now
    await report.save();

    // FIND USER WHO POSTED
    let post = await Post.findOne({ PostId: report.Postid });
    let userwhoposted = post.Postedby; // username of the person who posted

    
    // remove user WHO POSTED from followers
    let subgreddit = await Subgreddit.findOne({ PageId: report.whomreported });

    if(userwhoposted === subgreddit.Moderator) {
        res.status(400).json({error:"You Can't Block the Moderator"})
    }
    subgreddit.Followers = subgreddit.Followers.filter((follower) => follower.musername !== userwhoposted);
    await subgreddit.save();

    // block user from subgreddit
    let newblocked = new BlockedFromSubgreddit({
        PageId: report.whomreported,
        Userblocked: userwhoposted,
    })
    await newblocked.save();

    res.status(200).json({ message: "User Blocked" });
});

app.post('/api/deletepost', async (req, res) => {
    let data = req.body;

    let report = await Report.findOne({ ReportId: data.reportid });
    report.Status = "deleted";


    // find the post to be deleted
    await Post.deleteOne({ PostId: report.Postid });

    // delete ALL the REPORTS PERTAINING TO THAT POST also
    await Report.deleteMany({ Postid: report.Postid });

    // increase number of deleted posts
    let subgreddit = await Subgreddit.findOne({ PageId: report.whomreported });
    subgreddit.numdeletedposts = subgreddit.numdeletedposts + 1;
    await subgreddit.save();

    res.status(200).json({ message: "Post Deleted" });
})

app.post('/api/deletesubgreddit', async (req, res) => {
    let data = req.body; // pageid of the subgreddit to be deleted

    // delete all posts
    await Post.deleteMany({ PostedIn: data.pageid });

    // delete all reports
    await Report.deleteMany({ whomreported: data.pageid });

    // delete all visitors
    await Visitor.deleteMany({ Visited: data.pageid });

    // delete all banned users
    await BannedFromSubgreddit.deleteMany({ PageId: data.pageid });

    // delete all blocked users
    await BlockedFromSubgreddit.deleteMany({ PageId: data.pageid });

    // delete the whole subgreddit
    await Subgreddit.deleteMany({ PageId: data.pageid });
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});