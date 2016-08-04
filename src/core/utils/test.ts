import { TrackData } from 'src/core/tracks';


export const testUtils = {
  createIds: (count, id = 1): number[] => {
    let ids = [];
    for (let i = 0; i < count; i++, id++) {
      ids.push(id);
    }
    return ids;
  },

  createTrack: (id: number = 1): TrackData => {
    return {
      artwork_url: `https://i1.sndcdn.com/artworks-${id}-large.jpg`,
      duration: 240000, // 4 minutes
      id,
      likes_count: id,
      playback_count: id,
      stream_url: `https://api.soundcloud.com/tracks/${id}/stream`,
      streamable: true,
      title: `Title - ${id}`,
      user: {
        avatar_url: `https://i1.sndcdn.com/avatars-${id}-large.jpg`,
        id: 100 + id,
        username: `User-${id}`
      },
      user_favorite: false,
      waveform_url: `https://w1.sndcdn.com/${id}_m.png`
    };
  },

  createTracks: (count: number, startId: number = 1): TrackData[] => {
    let tracks = [];
    for (let i = startId; i <= count; i++) tracks.push(testUtils.createTrack(i));
    return tracks;
  }
};
