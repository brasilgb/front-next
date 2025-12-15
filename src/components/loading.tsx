"use client";

export default function LoadingRedirect() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            <p className="text-base text-muted-foreground mt-2">Redirecionando...</p>
        </div>
    );
}
