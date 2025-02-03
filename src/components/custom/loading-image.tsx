import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { Button } from "~components/ui/button";
import { LoadStatus } from "~constants";

type Props = {
  src: string;
  alt?: string;
  loading: LoadStatus;
};

export default function LoadingImage({ src, alt, loading }: Props) {
  return (
    <div className="relative w-full">
      <img
        className={clsx({ blur: loading === LoadStatus.Loading })}
        src={src}
        alt={alt}
        width="100%"
      />
      {loading === LoadStatus.Loading && (
        <Button
          className="absolute bottom-0 left-0 right-0 top-0 m-auto"
          disabled
          variant="ghost"
        >
          <LoaderCircle className="animate-spin" />
          <span>Saving</span>
        </Button>
      )}
    </div>
  );
}
