import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CustomerSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="shadow-sm border-t-4 border-slate-200">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="h-9 w-9 rounded-lg bg-slate-200" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 w-full bg-slate-100 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
    {/* Large Financial Row Skeleton */}
    <div className="md:col-span-2 lg:col-span-3 h-32 bg-slate-100 rounded-xl border border-slate-200" />
  </div>
);

export default CustomerSkeleton;