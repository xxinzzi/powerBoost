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
- Response:
  - 로그인 성공 시: 토큰 반환
    ```
    {
      "token": "eyJhbGciOiJI~~~~~"
    }
    ```
  - 로그인 실패 시:
    ```
    {
      "message": "Invalid credentials"
    }
    ```
  
### `GET`/logout
- 로그아웃
- Client 단에서 토큰 삭제

### `PATCH`/users/:id
- 유저 정보 수정
- 사용자 인증 필요
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
- 사용자 인증 필요
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
- 사용자 인증 필요
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
- 사용자 인증 필요
- Request:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

### `PATCH`/posts/:id/like
- 게시글에 좋아요 추가/취소
- 사용자 인증 필요
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
- 사용자 인증 필요
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
- 사용자 인증 필요
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
- 사용자 인증 필요
- Request: 
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

##📝
###2주차
1. **사용자 생성 (회원가입)**
  - `bcrypt` 라이브러리를 사용하여 비밀번호를 해싱하여 저장
    ```javascript
    export async function hashPassword(password) {
      return bcrypt.hash(password, 10);
    }
    ```
2. **사용자 로그인**
  - 요청 바디: `email`과 `password`를 포함
  - 데이터베이스 조회: 주어진 이메일로 사용자를 조회
  - 비밀번호 검증: 입력된 비밀번호가 저장된 해시와 일치하는지 확인
    ```javascript
    export async function comparePassword(password, hash) {
      return bcrypt.compare(password, hash);
    }
    ```
3. **JWT 토큰 생성**
  - 비밀번호가 일치하면 JWT 토큰을 생성하여 클라이언트에 반환
    ```javascript
    export function generateToken(user) {
      return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h", //토큰은 1시간 동안 유효
      });
    }
    ```
4. **사용자 인증이 필요한 경로 보호**
  - JWT 토큰 인증: `authenticateToken` 미들웨어를 통해 요청이 인증된 사용자로부터 온 것인지 확인
  - 사용자 ID 검증: 요청된 사용자 ID와 인증된 사용자 ID가 일치하는지 확인
    ```javascript
    export async function authenticateToken(req, res, next) {
      const token = req.headers["authorization"]; //요청 헤더에서 JWT 토큰을 읽어 검증
      if (!token) return res.sendStatus(401);

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403); //토큰이 유효하지 않으면 403 상태 코드 반환

        req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        next(); //유효한 토큰이면 사용자 정보를 요청 객체에 추가하고 다음 미들웨어로 넘어감
      });
    }
    ```
**새롭게 알게 된 점**: bcrypt를 사용하여 비밀번호 보안을 강화할 수 있다

