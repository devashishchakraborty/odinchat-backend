import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true, 
      email: true
    }
  });

  if (!users) return res.sendStatus(500);
  res.send(users);
};

const deleteUser = async (req, res) => {
  const user = await prisma.user.delete({
    where: {
      id: parseInt(req.user.id),
    },
  });

  if (!user) return res.sendStatus(500);
  res.send(user);
};

export default {
  getUsers,
  deleteUser,
};
