import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getProfileByUserId = async (req, res) => {
  const profile = await prisma.profile.findMany({
    where: {
      user_id: parseInt(req.params.userId) || req.user.id,
    },
  });

  if (!profile) return res.sendStatus(500);
  res.send(profile[0]);
};

const editProfile = async (req, res) => {
  const profileDetails = req.body;
  const profile = await prisma.profile.update({
    where: {
      user_id: parseInt(req.user.id),
    },
    data: profileDetails,
  });

  if (!user) return res.sendStatus(500);
  res.send(profile);
};

export default {
  getProfileByUserId,
  editProfile,
};
