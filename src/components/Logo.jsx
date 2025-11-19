import logoImage from '../assets/logo.png';

const Logo = ({ className = "", size = "normal" }) => {
  const sizes = {
  small: "h-14",
  normal: "h-16",
  large: "h-20"
};

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Indavco Systems" 
        className={`${sizes[size]} w-auto`}
      />
    </div>
  );
};

export default Logo;