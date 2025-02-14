import SaveBtn from "~components/custom/save-btn";
import StatefulImage from "~components/custom/stateful-image";
import { H4, Muted } from "~components/custom/typography";
import { Badge } from "~components/ui/badge";
import { LoadStatus } from "~constants";
import type { Post } from "./hook";

type Props = {
  post: Post;
  postLoading: LoadStatus;
  onSave: (post: Post) => void;
};

export default function Post({ post, postLoading, onSave }: Props) {
  const {
    preview,
    thumbPath,
    resolution,
    rating,
    tags,
    score,
    user,
    directLink,
  } = post;
  return (
    <div className="flex flex-col items-start gap-1">
      {preview && (
        <StatefulImage src={preview} alt={thumbPath} loading={postLoading} />
      )}
      {thumbPath && <H4>{thumbPath}</H4>}
      {resolution && (
        <div className="space-x-2">
          <Muted>Resolution:</Muted>
          <span>{resolution}</span>
        </div>
      )}
      {rating && (
        <div className="space-x-2">
          <Muted>Rating:</Muted>
          <Badge variant="secondary">{rating}</Badge>
        </div>
      )}
      {score && !Number.isNaN(score) && (
        <div className="space-x-2">
          <Muted>Score:</Muted>
          <span>{score}</span>
        </div>
      )}
      {tags && (
        <div className="space-x-2 space-y-2">
          <Muted>Tags:</Muted>
          {tags.map((tag) => (
            <Badge variant="secondary" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {user && (
        <div className="space-x-2">
          <Muted>User:</Muted>
          <span>{user}</span>
        </div>
      )}
      {directLink && (
        <SaveBtn status={postLoading} onClick={() => onSave(post)} />
      )}
    </div>
  );
}
