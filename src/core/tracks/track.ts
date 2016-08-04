import { Map, Record } from 'immutable';
import { formatTrackTitle, streamUrl, trackImageUrl, waveformUrl } from './utils';


export interface TrackData {
  artwork_url: string;
  duration: number;
  favoritings_count?: number;
  id: number;
  likes_count?: number;
  playback_count: number;
  stream_url: string;
  streamable: boolean;
  title: string;
  user: {
    avatar_url: string;
    id: number;
    username: string;
  };
  user_favorite?: boolean;
  waveform_url: string;
}

export interface Track extends Map<string,any> {
  artworkUrl: string;
  duration: number;
  id: number;
  liked: boolean;
  likesCount: number;
  playbackCount: number;
  streamable: boolean;
  streamUrl: string;
  title: string;
  userId: number;
  username: string;
  waveformUrl: string;
}

export const TrackRecord = Record({
  artworkUrl: null,
  duration: null,
  id: null,
  liked: null,
  likesCount: null,
  playbackCount: null,
  streamable: null,
  streamUrl: null,
  title: null,
  userId: null,
  username: null,
  waveformUrl: null
});

export function createTrack(data: TrackData): Track {
  return new TrackRecord({
    artworkUrl: trackImageUrl(data),
    duration: data.duration,
    id: data.id,
    liked: !!data.user_favorite,
    likesCount: data.favoritings_count || data.likes_count || 0,
    playbackCount: data.playback_count || 0,
    streamable: data.streamable,
    streamUrl: data.streamable ? streamUrl(data.stream_url) : null,
    title: formatTrackTitle(data.title),
    userId: data.user.id,
    username: data.user.username,
    waveformUrl: waveformUrl(data.waveform_url)
  }) as Track;
}
