export function padPokemonId(id: number) {
  return id.toString().padStart(3, '0');
}
