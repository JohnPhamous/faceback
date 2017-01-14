# hackuci2017
Example Insertions:<br></br>

Page.insert(url: “url”, name:  “name”, posts: [“urls of pages”], created: ISODate(now))<br></br>

Post.insert(url: “url”, text: “text”, page: “url”,  phrases: [“keywords”], comments: [“keywords from comments”], like: 0, love: 1, haha: 1, wow: 1, sad: 1, angry: 1, date: ISODate(post_time), created: ISODate(now))<br></br>

Phrase.insert(phrase: “phrase”, posts: [“urls of posts”], created: ISODate(now))<br></br>

*Note that arrays may be left as [] if empty<br></br>
