export default function usage(error?: string) {
  if (error) {
    console.error(`${error}\n`);
  }
  console.log('Tiktok Live Recorder');
  console.info('USAGE:');
  console.info('    tlr [-u USER] [-w "USER1 USER2 ..."] [-o OUTPUT]\n');
  console.info('OPTIONS:');
  console.info('    -u, --user USER');
  console.info(`        Record a livestream from the username`);
  console.info('    -w, --watch "USER1 USER2 ..."');
  console.info(`        Automatic live recording when a user from the provided list is in live`);
  console.info('    -o, --output OUTPUT');
  console.info(`        Output directory`);
  console.info('    -h, --help');
  console.info('        Prints help information');
  Deno.exit();
}
