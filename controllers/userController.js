import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { NOT: { id: req.user.id } },
    select: {
      id: true,
      name: true,
      email: true,
      messages_sent: {
        where: {
          receiver_id: req.user.id,
        },
        orderBy: { created_at: "desc" },
        take: 1,
      },
      messages_received: {
        where: {
          author_id: req.user.id,
        },
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });

  if (!users) return res.sendStatus(500);

  const usersWithLatestMessage = users.map((user) => {
    const sent = user.messages_sent[0];
    const received = user.messages_received[0];

    let latestMessage = null;
    if (sent && received) {
      latestMessage = sent.created_at > received.created_at ? sent : received;
    } else {
      latestMessage = sent || received || null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      latestMessage,
    };
  });

  res.send(usersWithLatestMessage);
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
