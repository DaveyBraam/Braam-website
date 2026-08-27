type ProjectGalleryProps = {
  expanded?: boolean;
};

const installationProjects = [
  {
    image: "/projects/installaties/installatie-02.webp",
    tag: "Warmtepomp",
    title: "Buitenunit op het dak",
    stage: "Geplaatst",
    alt: "Warmtepomp-buitenunit geplaatst op een plat dak door Rob Braam",
  },
  {
    image: "/projects/installaties/installatie-03.webp",
    tag: "Warmtepomp",
    title: "Complete binnenopstelling",
    stage: "Tijdens montage",
    alt: "Warmtepomp met voorraadvat en buffervat tijdens montage door Rob Braam",
  },
  {
    image: "/projects/installaties/installatie-06.webp",
    tag: "Installatiewerk",
    title: "Techniekruimte op maat",
    stage: "Tijdens inregeling",
    alt: "Compact ingepaste warmtepompinstallatie in een techniekruimte",
  },
  {
    image: "/projects/installaties/installatie-08.webp",
    tag: "Cv-ketel",
    title: "Ketel en leidingwerk",
    stage: "Tijdens inbedrijfstelling",
    alt: "Nieuwe cv-ketel met vernieuwd leidingwerk tijdens inbedrijfstelling",
  },
  {
    image: "/projects/installaties/installatie-01.webp",
    tag: "Warmtepomp",
    title: "Binnenunit met buffervat",
    stage: "Tijdens montage",
    alt: "Warmtepomp-binnenunit met buffervat en leidingwerk tijdens montage",
  },
  {
    image: "/projects/installaties/installatie-04.webp",
    tag: "Hybride",
    title: "Techniekwand met voorraadvat",
    stage: "Tijdens montage",
    alt: "Hybride warmtepompopstelling met voorraadvat en leidingwerk",
  },
  {
    image: "/projects/installaties/installatie-05.webp",
    tag: "All-electric",
    title: "Warmtepomp-binnenopstelling",
    stage: "Tijdens montage",
    alt: "All-electric warmtepomp-binnenopstelling met buffervat en expansievat",
  },
  {
    image: "/projects/installaties/installatie-07.webp",
    tag: "Warmtepomp",
    title: "Ingepast op zolder",
    stage: "Tijdens montage",
    alt: "Warmtepomp met buffervat ingepast onder een schuin dak",
  },
  {
    image: "/projects/installaties/installatie-09.webp",
    tag: "Warm water",
    title: "Voorraadvat in de woning",
    stage: "Tijdens montage",
    alt: "Warmwatervoorraadvat geplaatst in een technische ruimte in een woning",
  },
];

export function ProjectGallery({ expanded = false }: ProjectGalleryProps) {
  const projects = expanded ? installationProjects : installationProjects.slice(0, 5);

  return (
    <div className={`project-gallery ${expanded ? "project-gallery-expanded" : "project-gallery-featured"}`}>
      {projects.map((project) => (
        <figure className="project-shot" key={project.image}>
          <img
            src={project.image}
            alt={project.alt}
            width="960"
            height="1280"
            loading="lazy"
            decoding="async"
          />
          <span className="project-stage">{project.stage}</span>
          <figcaption>
            <span>{project.tag}</span>
            <strong>{project.title}</strong>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
