import { useRef, useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';
import type { SpringConfig } from '@react-spring/web';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 200,
  className = '',
  animateBy = 'letters',
  direction = 'top',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  //const [inView, setInView] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          //setInView(entry.isIntersecting);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: {
        filter: 'blur(10px)',
        opacity: 0,
        transform: direction === 'top' ? 'translate3d(0,-50px,0)' : 'translate3d(0,50px,0)',
      },
      
to: async (next: (animationProps: Record<string, unknown>) => Promise<unknown>) => {
  await new Promise((resolve) => setTimeout(resolve, i * delay));
  await next({
    filter: 'blur(0px)',
    opacity: 1,
    transform: 'translate3d(0,0px,0)',
  });
},
      config: { tension: 120, friction: 14 } as SpringConfig,
    }))
  );

  return (
    <h1 ref={ref} className={`flex flex-wrap justify-center ${className}`}>
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={props}
          className="inline-block will-change-[transform,opacity,filter]"
        >
          {elements[index] === ' ' ? '\u00A0' : elements[index]}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </animated.span>
      ))}
    </h1>
  );
};

export default BlurText;