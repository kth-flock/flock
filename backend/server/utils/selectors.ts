export const publicUserInformationSelect = {
  id: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
};

export const profileUserInformationSelect = {
  ...publicUserInformationSelect,
  createdAt: true,
};

export const privateUserInformationSelect = {
  ...profileUserInformationSelect,
  email: true,
};