import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/actions'
import { ProtectedAppSidebar } from '@/components/protected/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { BreadcrumbNav } from '@/components/protected/breadcrumb-nav'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: user, error } = await getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <SidebarProvider>
      <ProtectedAppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}