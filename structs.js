import * as s from "superstruct";
import isEmail from "is-email";
import isUuid from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuid.v4(value));

const STATUSES = ["ACTIVE", "DELETED"]; // 게시물 상태를 나타내는 상수 배열

export const CreateUser = s.object({
  firstName: s.size(s.string(), 1, 30),
  lastName: s.size(s.string(), 1, 30),
  nickname: s.size(s.string(), 1, 30),
  password: s.size(s.string(), 1, 30),
  email: s.define("Email", isEmail),
});

export const PatchUser = s.partial(CreateUser);

export const CreatePost = s.object({
  userId: Uuid,
  title: s.string(),
  content: s.string(),
  status: s.enums(STATUSES),
});

export const PatchPost = s.partial(CreatePost);

export const CreateComment = s.object({
  userId: Uuid,
  postId: Uuid,
  content: s.string(),
});

export const PatchComment = s.object({
  content: s.string(),
});
