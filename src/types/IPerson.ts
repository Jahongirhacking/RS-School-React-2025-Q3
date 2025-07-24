export default interface IPerson {
  name: string;
  birth_year: string;
  created: string;
  edited: string;
  eye_color: string;
  films: string[]; // URLs to film resources
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string; // URL to planet resource
  mass: string;
  skin_color: string;
  species: string[]; // URLs to species resources
  starships: string[]; // URLs to starships
  url: string;
  vehicles: string[]; // URLs to vehicles
}
