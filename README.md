# powerBoost Study
## 이화여대 파워부스트 스터디

### 사용법
```
npm install
npm run dev
```

## API 명세서

### `POST`/signup
- 회원가입
- Request:
  ```
  Content-Type: application/json
  
  {
      "firstName" : "민지",
      "lastName" : "김",
      "nickname": "xxinzzi",
      "password": "xinzi0000",
      "email": "mintlima03@naver.com"
  }
  ```

### `POST`/login
- 로그인
- Request:
  ```
  Content-Type: application/json
  
  {
      "password": "xinzi0000",
      "email": "mintlima03@naver.com"
  }
  ```
- Response: 토큰 반환
  ```
  {
  "token": "eyJhbGciOiJI~~~~~"
  }
  ```
  
### `GET`/logout
- 로그아웃
- Client 단에서 토큰 삭제

### `PATCH`/users/:id
- 유저 정보 수정
- Request:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE

  {
      "nickname": "xxinnzee"
  }
  ```
  
### `GET`/posts
- 전체 게시글 조회
- Response:
  ```
  [
  {
    "id": "f8013040-b076-4dc4-8677-11be9a17162f",
    "userId": "b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e",
    "title": "제목1",
    "content": "내용1",
    "createdAt": "2024-07-17T17:47:33.910Z",
    "updatedAt": "2024-07-17T17:47:33.910Z"
  },
  {
    "id": "d2ff3048-83bc-425a-8ad3-d6d9af1c7c6d",
    "userId": "6c3a18b0-11c5-4d97-9019-9ebe3c4d1317",
    "title": "제목2",
    "content": "내용2",
    "createdAt": "2024-07-17T17:47:33.910Z",
    "updatedAt": "2024-07-17T17:47:33.910Z"
  }
  ]
  ```

### `GET`/posts/:id
- 특정 게시글 조회 (댓글, 좋아요 함께 표시)
- Response:
  ```
  {
    "id": "a309d999-8941-4c95-bab2-cdd9223151bd",
    "userId": "42a3c80f-e5de-4ef5-8855-85f6c1b5f87c",
    "title": "제목",
    "content": "내용",
    "createdAt": "2024-07-17T17:53:20.197Z",
    "updatedAt": "2024-07-17T17:53:20.197Z",
    "comments": [
      {
        "id": "b75f1cfa-4a80-44cf-9916-c6b8ea75eb65",
        "userId": "42a3c80f-e5de-4ef5-8855-85f6c1b5f87c",
        "content": "반가워요!",
        "updatedAt": "2024-07-17T18:15:17.785Z"
      }
    ],
    "likes": [
      {
        "userId": "42a3c80f-e5de-4ef5-8855-85f6c1b5f87c"
      }
    ]
  }
  ```

### `POST`/posts
- 새로운 게시글 작성
- Request:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  
  {
      "title": "제목",
      "content": "내용"
  }
  ```

### `PATCH`/posts/:id
- 게시글 수정
- Request:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  
  {
      "title": "수정 제목",
      "content": "수정 내용"
  }
  ```

### `DELETE`/posts/:id
- 게시글 삭제
- Request:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

### `PATCH`/posts/:id/like
- 게시글에 좋아요 추가/취소
- Request:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- Response:
  ```
  //좋아요
  {
    "id": "eded93a5-6552-482c-82f6-f68422b8b119",
    "userId": "42a3c80f-e5de-4ef5-8855-85f6c1b5f87c",
    "postId": "a309d999-8941-4c95-bab2-cdd9223151bd"
  }

  //좋아요 취소
  {
  "message": "Like removed"
  }
  ```
  
### `POST`/posts/:id/comment
- 게시글에 댓글 추가
- Request: 
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  
  {
      "content": "반가워요!"
  }
  ```
  
### `PATCH`/comments/:id
- 댓글 수정
- Request: 
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  
  {
      "content": "친해져요"
  }
  ```

### `DELETE`/comments/:id
- 댓글 삭제
- Request: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
