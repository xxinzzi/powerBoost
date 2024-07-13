# powerBoost Study
## 이화여대 파워부스트 스터디

## 사용법
```
npm install
npm run dev
```

## API 명세서

### <mark>GET</mark> /posts
- 전체 게시글 조회
- Response:
  ```
  [
  {
    "id": 1,
    "title": "첫 번째 게시글",
    "content": "첫 번째 내용",
    "createdAt": "2024-07-13T18:09:28.848Z",
    "updatedAt": "2024-07-13T18:09:28.848Z",
    "comments": [],
    "likes": 0
  },
  {
    "id": 2,
    "title": "두 번째 게시글",
    "content": "두 번째 내용",
    "createdAt": "2024-07-13T18:09:28.848Z",
    "updatedAt": "2024-07-13T18:09:28.848Z",
    "comments": [
      {
        "userId": "user1",
        "comment": "첫 번째 댓글"
      }
    ],
    "likes": 3
  }
  ]
  ```
  

### <mark>GET</mark> /posts/:id
- 특정 게시글 조회
- Response:
  ```
  {
    "title": "제목",
    "content": "내용",
    "id": 2,
    "createdAt": "2024-07-13T18:09:28.848Z",
    "updatedAt": "2024-07-13T18:09:28.848Z",
    "comments": [
      {
        "userId": "user",
        "comment": "댓글"
      }
    ],
    "likes": 3
  }
  ```
  

### <mark>POST</mark> /posts
- 새로운 게시글 작성
- Request:
  ```
  {
      "title": "제목",
      "content": "내용"
  }
  ```
  

### <mark>PATCH</mark> /posts/:id
- 게시글 수정
- Request:
  ```
  {
      "title": "수정 제목",
      "content": "수정 내용"
  }
  ```
  

### <mark>DELETE</mark> /posts/:id
- 게시글 삭제
- Response: HTTP 204 No Content


### <mark>PATCH</mark> /posts/:id/like
- 게시글에 좋아요 추가/취소
- Request:
  ```
  {
      "userId": "user1"
  }
  ```
- Response:
  ```
  {  
    "likes": 1
  }
  ```
  

### <mark>PATCH</mark> /posts/:id/comment
- 게시글에 댓글 추가
- Request: 
  ```
  {
      "userId": "user1"
      "comment": "댓글"
  }
  ```
