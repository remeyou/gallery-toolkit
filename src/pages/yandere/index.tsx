import Cover from '~components/custom/cover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~components/ui/tabs'
import { useData } from './hook'
import Pool from './pool'
import Post from './post'

export default function Yandere() {
  const { post, postLoading, pool, poolLoading, onSave, onSavePool } = useData()
  return (
    <Tabs defaultValue="0">
      {Boolean(pool.length) && (
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="0">Post</TabsTrigger>
          <TabsTrigger value="1">Pool</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="0">
        {Object.keys(post).length ? (
          <Post post={post} postLoading={postLoading} onSave={onSave} />
        ) : (
          <Cover />
        )}
      </TabsContent>
      <TabsContent value="1">
        <Pool pool={pool} poolLoading={poolLoading} onSavePool={onSavePool} />
      </TabsContent>
    </Tabs>
  )
}
