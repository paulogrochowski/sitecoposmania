import { Wrench } from "lucide-react";
import type { LucideProps } from "lucide-react";
import React from 'react';

interface AdminPlaceholderProps {
    title: string;
    icon?: React.ComponentType<LucideProps>;
    hideTitle?: boolean;
}

export function AdminPlaceholder({ title, icon: Icon = Wrench, hideTitle = false }: AdminPlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-muted/50 rounded-lg border-2 border-dashed">
            <Icon className="w-12 h-12 text-muted-foreground mb-4" />
            {!hideTitle && <h3 className="text-xl font-bold">{title}</h3>}
            <p className="text-muted-foreground">Esta funcionalidade está em desenvolvimento.</p>
        </div>
    )
}
