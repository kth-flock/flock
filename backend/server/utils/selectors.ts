export const publicUserInformationSelect = {
  id: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  createdAt: true,
};

export const privateUserInformationSelect = {
  ...publicUserInformationSelect,
  email: true,
};
