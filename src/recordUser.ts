import { writableStreamFromWriter } from './deps.ts';
import { path } from './deps.ts';

export default async function recordUser(user: string, output?: string) {
  const roomId = await getRoomId(user);
  if (!roomId) {
    console.error(`could not get roomId for ${user}`);
    return;
  }
  const url = await getLiveUrl(roomId);
  if (!url) {
    console.error(`could not get live url for ${user}`);
    return;
  }
  const isLive = await isUserInLive(roomId);
  if (!isLive) {
    console.log(`${user} is offline`);
    return;
  }

  const fileResponse = await fetch(url);
  if (fileResponse.body) {
    window.recording[user] = true;
    console.log(`Started recording ${user}...`);

    const file = await Deno.open(filename(user, output), { write: true, create: true }).catch(
      () => {
        console.error('could not open output dir to write');
        Deno.exit();
      }
    );
    const writableStream = writableStreamFromWriter(file);
    await fileResponse.body.pipeTo(writableStream);
    window.recording[user] = false;
    console.log(`${user}'s stream ended`);
  }
}

async function getRoomId(user: string) {
  return await fetch(`https://www.tiktok.com/@${user}/live`)
    .then(res => res.text())
    .then(text => {
      const roomId = text.match(/room_id=(\d*)"/)?.[1];
      return roomId;
    });
}

async function isUserInLive(roomId: string): Promise<boolean | undefined> {
  return await fetch(`https://www.tiktok.com/api/live/detail/?aid=1988&roomID=${roomId}`)
    .then(res => res.json())
    .then(json => json.LiveRoomInfo?.status != 4);
}

async function getLiveUrl(roomId: string): Promise<string | undefined> {
  return await fetch(`https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${roomId}`)
    .then(res => res.json())
    .then(json => json.data?.stream_url?.rtmp_pull_url);
}

function filename(user: string, output?: string): string {
  const date = new Date();
  const day = date.toISOString().slice(0, 10);
  const time = date.toTimeString().slice(0, 8).replaceAll(':', '-');
  const file = `${user}_${day}_${time}.flv`;
  return output ? path.join(output, file) : file;
}
