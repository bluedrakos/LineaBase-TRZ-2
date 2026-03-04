<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class FrontendModuleScaffolder
{
    public function ensure(string $moduleSlug, string $moduleName = 'Modulo'): string
    {
        $slug = $this->sanitizeSlug($moduleSlug);
        $root = base_path("frontend/src/modules/{$slug}");

        $this->createStructure($root, $moduleName, $slug);

        return "frontend/src/modules/{$slug}";
    }

    public function rename(string $oldSlug, string $newSlug, string $moduleName): string
    {
        $oldSlug = $this->sanitizeSlug($oldSlug);
        $newSlug = $this->sanitizeSlug($newSlug);

        if ($oldSlug === $newSlug) {
            return "frontend/src/modules/{$newSlug}";
        }

        $oldRoot = base_path("frontend/src/modules/{$oldSlug}");
        $newRoot = base_path("frontend/src/modules/{$newSlug}");

        if (File::exists($oldRoot) && !File::exists($newRoot)) {
            File::move($oldRoot, $newRoot);
        } else {
            $this->createStructure($newRoot, $moduleName, $newSlug);
        }

        return "frontend/src/modules/{$newSlug}";
    }

    private function createStructure(string $root, string $moduleName, string $slug): void
    {
        $directories = [
            "{$root}/pages",
            "{$root}/pages/components",
            "{$root}/hooks",
            "{$root}/services",
            "{$root}/schemas",
        ];

        foreach ($directories as $directory) {
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }
        }

        $indexPath = "{$root}/pages/Index.jsx";
        if (!File::exists($indexPath)) {
            File::put($indexPath, $this->indexTemplate($moduleName, $slug));
        }
    }

    private function sanitizeSlug(string $slug): string
    {
        return Str::of($slug)->slug()->lower()->value() ?: 'modulo';
    }

    private function indexTemplate(string $moduleName, string $slug): string
    {
        $title = addslashes($moduleName);

        return <<<JSX
import LayoutDashboard from '@/app/layouts/AdminLayout';
import { Head } from '@/shared/app-bridge';

export default function Index() {
    return (
        <LayoutDashboard>
            <Head title="{$title}" />
            <div className="mx-auto w-full max-w-[1240px] space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{$title}</h2>
                    <p className="text-muted-foreground">
                        Nuevo módulo generado automáticamente.
                    </p>
                </div>
            </div>
        </LayoutDashboard>
    );
}
JSX;
    }
}
