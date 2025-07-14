import { Icons } from './icons';

interface LoaderProps {
  message?: string;
  showText?: boolean;
}

export function Loader({ message = "Carregando...", showText = true }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 rounded-lg text-card-foreground w-full">
      <Icons.cheers className="w-24 h-24 text-primary" />
      {showText && (
        <div className="text-center">
            <p className="text-muted-foreground mt-2">{message}</p>
        </div>
      )}
    </div>
  );
}
