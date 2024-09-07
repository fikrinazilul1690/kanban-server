import slugify from 'slugify';

export async function generateUniqueSlugify(
  str: string,
  fn: (potential: string) => Promise<Array<{ slug: string }>>,
): Promise<string> {
  let suffix = 0;
  let potential: string, base: string;
  potential = base = slugify(str, { lower: true });
  if (potential.length == 0) {
    potential = 'null';
  }

  const project = await fn(potential);

  if (project.length === 0) {
    return potential;
  }

  while (true) {
    if (!!suffix) {
      potential = `${base}-${suffix}`;
    }
    if (!project.find(({ slug }) => slug === potential)) {
      return potential;
    }
    suffix++;
  }
}
