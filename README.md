# hackuci2017
Example Insertions:

```javascript

Page.insert(url: “url”, name:  “name”, posts: [“urls of pages”], created: ISODate(now))

Post.insert(url: “url”, text: “text”, page: “url”,  phrases: [“keywords”], comments: [“keywords from comments”], like: 0, love: 1, haha: 1, wow: 1, sad: 1, angry: 1, date: ISODate(post_time), created: ISODate(now))

Phrase.insert(phrase: “phrase”, posts: [“urls of posts”], created: ISODate(now))

```

*Note that arrays may be left as [] if empty
