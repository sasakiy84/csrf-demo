type Users = {
  [name: string]: {
    password: string;
  };
};

type SessionIds = {
  [sessionId: string]: {
    userName: string;
  };
};

export const users: Users = {
  wowow: {
    password: "whooo!",
  },
};

export const changePassword = (userName: string, newPassword: string) => {
  if (!(userName in users)) {
    throw new Error("user not exists!!");
  }
  users[userName].password = newPassword;
  console.log(`${userName} password is changed to ${newPassword}`);
};

export const sessionIds: SessionIds = {};
export const csrfTokens: string[] = [];
