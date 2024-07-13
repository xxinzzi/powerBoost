import express from "express";
const app = express();
app.use(express.json());

let posts = [];
let comments = {};
let likes = {};

//전체 글 조회
app.get("/posts", (req, res) => {
  res.send(posts);
});

//특정 글 조회 (댓글, 좋아요 함께 표시)
app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((post) => post.id === id);

  if (post) {
    res.send({ ...post, comments: comments[id], likes: likes[id].length });
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

//글 작성
app.post("/posts", (req, res) => {
  const newPost = req.body;

  newPost.id = getNextId(posts);
  newPost.createdAt = new Date();
  newPost.updatedAt = new Date();

  likes[newPost.id] = [];
  comments[newPost.id] = [];

  posts.push(newPost);
  res.status(201).send(newPost);
});

//글 수정
app.patch("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((post) => post.id === id);

  if (post) {
    Object.keys(req.body).forEach((key) => {
      post[key] = req.body[key];
    });
    post.updatedAt = new Date();
    res.send(post);
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

//글 삭제
app.delete("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = posts.findIndex((pos) => pos.id === id);
  if (idx >= 0) {
    posts.splice(idx, 1);

    delete likes[id];
    delete comments[id];

    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

//게시글 좋아요
app.patch("/posts/:id/like", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((post) => post.id === id);
  const userId = req.body;

  if (post) {
    const idx = likes[id].indexOf(userId);
    if (idx === -1) {
      likes[id].push(userId);
    } else {
      //사용자가 이미 좋아요를 눌렀는지 확인하고,
      likes[id].splice(idx, 1); //이미 눌렀다면 좋아요를 제거
    }
    res.send(`likes: ${likes[id].length}`);
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

//게시글 댓글
app.patch("/posts/:id/comment", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((post) => post.id === id);
  const { userId, comment } = req.body;

  if (post) {
    comments[id].push({ userId, comment });
    res.send(comments[id]);
  } else {
    res.status(404).send({ message: "Cannot find given id" });
  }
});

// 유틸리티 함수: 다음 ID 생성
function getNextId(arr) {
  return arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
}

app.listen(3000, () => console.log("Server Started"));
