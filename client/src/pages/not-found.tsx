import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import BrandLogo from "@/components/brand-logo";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md mx-4 glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <BrandLogo className="w-8 h-8" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-50">Bulwark7</h1>
          </div>
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-50">404 Page Not Found</h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            The page you were looking for doesn’t exist or has moved.
          </p>

          <div className="mt-6">
            <Link href="/">
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                <Home className="w-4 h-4" />
                Go back home
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
