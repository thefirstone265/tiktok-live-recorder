import recordUser from './recordUser.ts';

export default function watchUsers(usersstr: string, output?: string) {
  const watchUsersIter = () => {
    const users = usersstr.split(' ');

    const checkUser = (i = 0) => {
      if (!window.recording[users[i]]) recordUser(users[i], output);
      else console.log(`Still recording ${users[i]}`);
      setTimeout(() => {
        if (i < users.length - 1) checkUser(++i);
        else
          console.log(
            `${new Date().toTimeString().slice(0, 8)}       Waiting for recheck in 3m...\n\n`
          );
      }, 3000);
    };
    checkUser();

    setTimeout(watchUsersIter, 180000);
  };

  watchUsersIter();
}
