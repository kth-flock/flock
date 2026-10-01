export const publicUserInformationSelect = {
  id: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
};

export const privateUserInformationSelect = {
  ...publicUserInformationSelect,
  email: true,
  createdAt: true,
};
