export type BrandLogoProps = {
  className?: string;
  alt?: string;
  src?: string;
};

const DEFAULT_LOGO = "https://i.ibb.co/r9yPr8f/image.png";

export function BrandLogo({
  className = "w-8 h-8 sm:w-12 sm:h-12",
  alt = "Bulwark7 logo",
  src = DEFAULT_LOGO,
}: BrandLogoProps) {
  const base = "rounded-full border-2 border-blue-500 object-cover";
  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${base}`}
      loading="eager"
      decoding="async"
    />
  );
}

export default BrandLogo;


