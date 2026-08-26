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
    title: 'Walking Home',
    artist: 'Danny Elfman',
    album: 'Silver Linings Playbook',
    src: '/audio/Walking-Home.mp3',
    art: 'https://images.pexels.com/photos/29218843/pexels-photo-29218843.jpeg',
  },
  {
    id: 't2',
    title: 'Snown Time',
    artist: 'Matthew C. Wright',
    album: 'Snow Season',
    src: '/audio/Snown.mp3',
    art: 'https://images.pexels.com/photos/7502327/pexels-photo-7502327.jpeg',
  },
  {
    id: 't3',
    title: 'Powder Snow',
    artist: 'Matthew C. Wright',
    album: 'Once in a Life',
    src: '/audio/Powder-Snow.mp3',
    art: 'https://images.pexels.com/photos/30814592/pexels-photo-30814592.jpeg',
  },
  {
    id: 't4',
    title: 'Happy Days',
    artist: 'Steven O\'Brien',
    album: 'Guitar Miniature No. 1',
    src: '/audio/Happy-Days.mp3',
    art: 'https://images.pexels.com/photos/32423073/pexels-photo-32423073.jpeg',
  },
];
