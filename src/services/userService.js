const fakeUser = {
  name: "Thabo",
  surname: "Mokoena",
  cardNumber: "TBS-0294817",
  balance: 87.50,
};

export async function getProfile() {
  await new Promise((r) => setTimeout(r, 400));
  return fakeUser;
}

export async function getBalance() {
  await new Promise((r) => setTimeout(r, 300));
  return { balance: fakeUser.balance };
}

export async function changePassword({ currentPassword, newPassword }) {
  await new Promise((r) => setTimeout(r, 500));
  if (currentPassword !== "password123") {
    throw new Error("Current password is incorrect");
  }
  if (!newPassword) {
    throw new Error("New password is required");
  }
  return { success: true };
}
