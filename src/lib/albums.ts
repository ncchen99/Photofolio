import data from "../../content/albums.json";

export type Social = {
  label: string;
  handle: string;
  href: string;
};

export type Bio = {
  name: string;
  nameEn: string;
  location: string;
  intro: string;
  social: Social[];
  avatar: string;
};

export type Photo = {
  src: string;
  thumb: string;
  width: number;
  height: number;
};

export type Album = {
  slug: string;
  title: string;
  titleEn: string;
  no: string;
  cover: string;
  date?: string | null;
  areas?: string[];
  description?: string;
  photos: Photo[];
};

type Manifest = { bio: Bio; albums: Album[] };

const manifest = data as unknown as Manifest;

export function getAllAlbums(): Album[] {
  return manifest.albums;
}

export function getAlbum(slug: string): Album | undefined {
  return manifest.albums.find((a) => a.slug === slug);
}

export function getNextAlbum(slug: string): Album | undefined {
  const albums = manifest.albums;
  const i = albums.findIndex((a) => a.slug === slug);
  if (i < 0) return undefined;
  return albums[(i + 1) % albums.length];
}

export function getBio(): Bio {
  return manifest.bio;
}
