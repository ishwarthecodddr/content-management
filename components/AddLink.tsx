'use client'
import { useState, useEffect } from "react"
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Trash2Icon, Copy, Loader2, Plus } from 'lucide-react';

type Link = {
    _id: string;
    title?: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

const getDisplayTitle = (link: Link) => {
    if (link.title && link.title.trim()) {
        return link.title.trim();
    }

    try {
        const parsed = new URL(link.url);
        return parsed.hostname.replace(/^www\./, "");
    } catch (error) {
        console.error("Failed to parse URL for title fallback", error);
        return "Untitled Link";
    }
};

export default function AddLink() {
    const [inputValue, setInputvalue] = useState("");
    const [titleValue, setTitleValue] = useState("");
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchLinks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/links');
            if (!response.ok) throw new Error("Failed to fetch links");
            const result: Link[] = await response.json();
            // Normalize any legacy entries that might be missing titles
            const normalized = result.map((item) => ({
                ...item,
                title: item.title?.trim(),
            }));
            // Sort by newest first if the API doesn't
            setLinks(normalized.reverse());
        } catch (e) {
            console.error(e);
            setError("Failed to load links");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleAddLink = async () => {
        if (!inputValue.trim() || !titleValue.trim()) return;
        setIsAdding(true);
        setError("");
        try {
            // Basic URL validation and formatting
            let urlToSave = inputValue.trim();
            if (!/^https?:\/\//i.test(urlToSave)) {
                urlToSave = 'https://' + urlToSave;
            }

            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "url": urlToSave, "title": titleValue.trim() }),
            })
            
            if (!response.ok) throw new Error("Failed to add link");
            
            const newLink: Link = await response.json();
            // Ensure the client immediately reflects the intended title
            const hydratedLink: Link = {
                ...newLink,
                title: titleValue.trim() || newLink.title,
            };
            setLinks(prev => [hydratedLink, ...prev]);
            setInputvalue("");
            setTitleValue("");
        } catch (e) {
            console.error(e);
            setError("Failed to add link. Please try again.");
        } finally {
            setIsAdding(false);
        }
    }

    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to delete this link?")) return;
        
        try {
            const response = await fetch(`/api/links/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error("Failed to delete");
            setLinks(prev => prev.filter(link => link._id !== id));
        } catch (e) {
            console.error(e);
            setError("Failed to delete link");
        }
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
            <div className="text-center space-y-2 pt-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Link Manager</h1>
                <p className="text-muted-foreground">Save and organize your favorite links in one place.</p>
            </div>

            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle>Add New Link</CardTitle>
                    <CardDescription>Enter a title and paste a URL below to save it to your collection.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <Input
                            value={titleValue}
                            type="text"
                            placeholder="Link Title (e.g., My Portfolio)"
                            className="h-11"
                            onChange={(e) => setTitleValue(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                value={inputValue}
                                type="url"
                                placeholder="https://example.com"
                                className="h-11"
                                onChange={(e) => setInputvalue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddLink();
                                }}
                            />
                            <Button 
                                size="lg" 
                                onClick={handleAddLink} 
                                disabled={isAdding || !inputValue.trim() || !titleValue.trim()}
                                className="h-11 px-8 shrink-0"
                            >
                                {isAdding ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                                Add Link
                            </Button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-semibold tracking-tight">Your Links</h2>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">{links.length} saved</span>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/30">
                        <p>No links yet. Add one above to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {links.map((item) => (
                            <Card
                                key={item._id}
                                className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-primary/0 hover:border-l-primary h-full"
                            >
                                <CardContent className="p-5 flex flex-col gap-4 h-full">
                                    <div className="space-y-2 min-h-[72px]">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-semibold text-foreground hover:text-primary hover:underline block truncate"
                                        >
                                            {getDisplayTitle(item)}
                                        </a>
                                        <p className="text-xs text-muted-foreground">
                                            Added on {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                                        </p>
                                    </div>

                                    <div className="mt-auto flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(item.url, item._id)}
                                            title="Copy URL"
                                            className="h-8 w-8"
                                        >
                                            {copiedId === item._id ? (
                                                <span className="text-xs font-bold text-green-600">✓</span>
                                            ) : (
                                                <Copy className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(item._id)}
                                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2Icon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}