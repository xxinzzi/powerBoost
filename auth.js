import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

/*
export async function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    next();
  });
}
*/

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.log("토큰 없음");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("토큰 검증 실패:", err.message);
      return res.sendStatus(403);
    }

    req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!req.user) {
      console.log("사용자 없음");
      return res.sendStatus(401);
    }

    console.log("인증 성공:", req.user.id);
    next();
  });
}
