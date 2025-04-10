import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Getting messages between user and texter
const getMessages = async (req, res) => {
  const { texterId } = req.params;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          author_id: parseInt(req.user.id),
          receiver_id: parseInt(texterId),
        },
        {
          author_id: parseInt(texterId),
          receiver_id: parseInt(req.user.id),
        },
      ],
    },
    orderBy: {
      created_at: "asc",
    },
  });
  if (!messages) {
    return res.sendStatus(500);
  }

  res.send(messages);
};

const createMessage = async (req, res) => {
  const { text } = req.body;
  const { texterId } = req.params;
  const message = await prisma.message.create({
    data: {
      text: text,
      receiver_id: parseInt(texterId),
      author_id: req.user.id,
    },
  });
  if (!message) {
    return res.sendStatus(500);
  }

  res.send(message);
};

const deleteMessage = async (req, res) => {
  const { messageId } = res.params;
  const message = await prisma.message.delete({
    where: {
      id: parseInt(messageId),
      author_id: parseInt(req.user.id),
    },
  });

  if (!message) return res.sendStatus(500);
  res.send(message);
};

export default {
  getMessages,
  createMessage,
  deleteMessage,
};
