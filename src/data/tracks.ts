export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  src: string;
  art: string;
}

export const tracks: Track[] = [
  {
    id: 't1',
    title: 'Midnight Reverie',
    artist: 'Eli Marlow',
    album: 'After Hours',
    src: '/audio/Kontraa_Water.mp3',
    art: 'https://images.pexels.com/photos/5667013/pexels-photo-5667013.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  },
  {
    id: 't2',
    title: 'Golden Hour',
    artist: 'Sable & The Tides',
    album: 'Sunset Sessions',
    src: '/audio/Powerful_Percussion.mp3',
    art: 'https://images.pexels.com/photos/14010611/pexels-photo-14010611.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  },
  {
    id: 't3',
    title: 'Velvet Static',
    artist: 'Nocturne',
    album: 'Analog Dreams',
    src: '/audio/track3.mp3',
    art: 'https://images.pexels.com/photos/8882645/pexels-photo-8882645.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  },
  {
    id: 't4',
    title: 'Ember Glow',
    artist: 'Lior Vance',
    album: 'Warm Wires',
    src: '/audio/track4.mp3',
    art: 'https://images.pexels.com/photos/13312404/pexels-photo-13312404.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  },
];
