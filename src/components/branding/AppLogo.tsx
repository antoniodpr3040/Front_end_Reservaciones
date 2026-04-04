import logoSrc from '../../assets/logo-dodate.png';

interface AppLogoProps {
  alt?: string;
  className?: string;
}

export function AppLogo({
  alt = 'Logo de DoDate',
  className = 'h-12 w-auto',
}: AppLogoProps) {
  return <img src={logoSrc} alt={alt} className={className} />;
}
