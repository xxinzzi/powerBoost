export const USERS = [
  {
    id: "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e",
    firstName: "John",
    lastName: "Doe",
    nickname: "johndoe",
    password: "password123",
    email: "john.doe@example.com",
  },
  {
    id: "6c3a18b0-11c5-4d97-9019-9ebe3c4d1317",
    firstName: "Jane",
    lastName: "Smith",
    nickname: "janesmith",
    password: "password123",
    email: "jane.smith@example.com",
  },
];

export const POSTS = [
  {
    id: "f8013040-b076-4dc4-8677-11be9a17162f",
    userId: "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e",
    title: "First Post",
    content: "This is the content of the first post.",
    status: "ACTIVE",
  },
  {
    id: "d2ff3048-83bc-425a-8ad3-d6d9af1c7c6d",
    userId: "6c3a18b0-11c5-4d97-9019-9ebe3c4d1317",
    title: "Second Post",
    content: "This is the content of the second post.",
    status: "ACTIVE",
  },
];

export const LIKES = [
  {
    id: "9fde1702-08d7-407c-8e6e-65e24f6a8237",
    userId: "6c3a18b0-11c5-4d97-9019-9ebe3c4d1317",
    postId: "f8013040-b076-4dc4-8677-11be9a17162f",
  },
];

export const COMMENTS = [
  {
    id: "ba758e4c-4ff1-4e61-ae94-6d727f7381d6",
    userId: "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e",
    postId: "d2ff3048-83bc-425a-8ad3-d6d9af1c7c6d",
    content: "This is a comment on the second post.",
  },
  {
    id: "a06a7eb9-75e3-4b13-81d5-9f1dd7a05175",
    userId: "6c3a18b0-11c5-4d97-9019-9ebe3c4d1317",
    postId: "f8013040-b076-4dc4-8677-11be9a17162f",
    content: "This is a comment on the first post.",
  },
];
