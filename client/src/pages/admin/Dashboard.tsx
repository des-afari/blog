import { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Tags from './components/Tags'
import Accounts from './components/Accounts'

const Dashboard: FC = () => {
  return (
    <main className='px-6'>
      <Tabs defaultValue='accounts'>
        <TabsList className='mt-4 mb-2'>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
        <TabsContent value='tags'>
          <Tags />
        </TabsContent>
        <TabsContent value='accounts'>
          <Accounts />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default Dashboard