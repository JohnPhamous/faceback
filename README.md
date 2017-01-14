# hackuci2017
Example Insertions:

```javascript

Page.insert(url: “url”, name:  “name”, posts: [“urls of pages”], , like: 0, love: 1, haha: 1, wow: 1, sad: 1, angry: 1)

Post.insert(url: “url”, text: “text”, page: “url”,  phrases: [“keywords”], comments: [“keywords from comments”], like: 0, love: 1, haha: 1, wow: 1, sad: 1, angry: 1, created: ISODate(post_time))

Phrase.insert(phrase: “phrase”, posts: [“urls of posts”])

```

*Note that arrays may be left as [] if empty
