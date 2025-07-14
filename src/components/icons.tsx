import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 1 0-2.82l2.83-2.83a2 2 0 0 1 2.82 0Z" />
        <path d="m19 5 3-3" />
    </svg>
  ),
  cup: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12h16" />
      <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8" />
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    </svg>
  ),
  cheers: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
      {...props}
    >
      {/* Champagne flute left */}
      <g className="glass-left">
          <path d="M 30 95 L 30 65" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 20 95 L 40 95" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 30 65 C 10 55, 10 20, 30 10 L 30 65" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
      {/* Champagne flute right */}
      <g className="glass-right">
          <path d="M 70 95 L 70 65" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 60 95 L 80 95" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 70 65 C 90 55, 90 20, 70 10 L 70 65" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
      {/* Spark */}
      <path
          className="spark"
          d="M50 20 L 52 15 L 54 20 L 60 22 L 54 24 L 52 29 L 50 24 L 44 22 Z"
          fill="hsl(var(--primary))"
      />
    </svg>
  ),
};
