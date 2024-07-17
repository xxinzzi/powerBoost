import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateToken,
} from "./auth.js";
import {
  CreateUser,
  PatchUser,
  CreatePost,
  PatchPost,
  CreateComment,
  PatchComment,
} from "./structs.js";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        //요청한 id를 찾을 수 없는 경우
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/*********** users ***********/

app.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({});
    res.send(users);
  })
);

app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      //findUniqueOrThrow: id가 없는 경우 에러 발생
      where: { id },
      include: {
        posts: true, //user를 조회할 때 작성한 post도 같이 표시
      },
    });
    if (!user) {
      return res.sendStatus(404);
    }
    res.send(user);
  })
);

app.patch(
  "/users/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    assert(req.body, PatchUser); //유효성 검사
    const { id } = req.params;
    if (id !== req.user.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.send(updatedUser);
  })
);

app.delete(
  "/users/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (id !== req.user.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    // id에 해당하는 유저 삭제
    await prisma.user.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

/*********** signup ***********/

app.post(
  "/signup",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateUser);
    const { firstName, lastName, nickname, password, email } = req.body;
    const hashedPassword = await hashPassword(password);
    console.log(`해시된 비밀번호: ${hashedPassword}`);
    const user = await prisma.user.create({
      data: { firstName, lastName, nickname, password: hashedPassword, email },
    });
    res.status(201).send(user);
  })
);

/*********** login ***********/

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } }); //해당 email을 가진 user 찾음

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    console.log("로그인 성공");
    res.send({ token });
  })
);

/*********** logout ***********/

app.get(
  "/logout",
  authenticateToken,
  asyncHandler(async (req, res) => {
    res.sendStatus(200); // Client should handle token deletion
  })
);

/*********** posts ***********/

//전체 게시글 조회
app.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const { order = "newest" } = req.query;
    let orderBy;
    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
    }
    const posts = await prisma.post.findMany({
      orderBy,
    });
    res.send(posts);
  })
);

//특정 게시글 조회 (댓글, 좋아요 개수 함께 표시)
app.get(
  "/posts/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: true,
        likes: true,
      },
    });
    res.send(post);
  })
);

//게시글 작성
app.post(
  "/posts",
  authenticateToken,
  asyncHandler(async (req, res) => {
    assert(req.body, CreatePost);
    const post = await prisma.post.create({
      data: { ...req.body, userId: req.user.id },
    });
    res.status(201).send(post);
  })
);

//게시글 수정
app.patch(
  "/posts/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    assert(req.body, PatchPost);
    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (post.userId !== req.user.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const updatedPost = await prisma.post.update({
      where: { id },
      data: req.body,
    });
    res.send(updatedPost);
  })
);

//게시글 삭제
app.delete(
  "/posts/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (post.userId !== req.user.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    await prisma.post.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

/*********** likes ***********/

// 좋아요 달기/해제
app.patch(
  "/posts/:postId/like",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId: req.user.id },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      res.send({ message: "Like removed" });
    } else {
      const like = await prisma.like.create({
        data: { postId, userId: req.user.id },
      });
      res.send(like);
    }
  })
);

/*********** comments ***********/

// 댓글 추가
app.post(
  "/posts/:postId/comment",
  authenticateToken,
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);
    const { postId } = req.params;
    const comment = await prisma.comment.create({
      data: { ...req.body, userId: req.user.id, postId },
    });
    res.send(comment);
  })
);

// 댓글 수정
app.patch(
  "/comments/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (comment.userId !== req.user.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: req.body,
    });
    res.send(updatedComment);
  })
);

// 댓글 삭제
app.delete(
  "/comments/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (comment.userId !== req.user.id) {
      return res.status(403).send({ message: "Forbidden" });
    }
    await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

app.listen(3000, () => console.log("Server Started"));
