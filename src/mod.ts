import { parse } from './deps.ts';
import usage from './usage.ts';
import recordUser from './recordUser.ts';
import watchUsers from './watchUsers.ts';

if (import.meta.main) {
  const { args } = Deno;
  const parsedArgs = parse(args);

  validateArgs(args, parsedArgs);

  const user = parsedArgs.u || parsedArgs.user;
  const users = parsedArgs.w || parsedArgs.watch;
  const output = parsedArgs.o || parsedArgs.output;
  if (user && users) {
    usage(`"-u" and "-w" should not be used at the same time`);
    Deno.exit();
  }
  if (output && typeof output !== 'string') {
    usage('-o: output dir is not provided');
    Deno.exit();
  }

  window.recording = {};

  if (user) {
    if (typeof user !== 'string') {
      usage('-u: username is not provided');
      Deno.exit();
    }
    recordUser(user, output);
  }

  if (users) {
    if (typeof users !== 'string') {
      usage('-w: user list is not provided');
      Deno.exit();
    }
    watchUsers(users, output);
  }
}

function validateArgs(
  args: string[],
  parsedArgs: {
    // deno-lint-ignore no-explicit-any
    [x: string]: any;
    _: (string | number)[];
  }
) {
  const allowedOpts = ['h', 'help', 'u', 'user', 'w', 'watch', 'o', 'output'];

  if (args.length == 0) {
    usage();
    Deno.exit();
  }

  Object.keys(parsedArgs).forEach(arg => {
    if (arg == '_') return;
    if (!allowedOpts.includes(arg)) {
      usage(`bad option: -${arg}`);
      Deno.exit();
    }
  });

  if (parsedArgs.help || parsedArgs.h) {
    usage();
    Deno.exit();
  }
}

declare global {
  interface Window {
    recording: {
      [user: string]: boolean;
    };
  }
}
