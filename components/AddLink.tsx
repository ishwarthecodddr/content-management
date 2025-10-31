'use client'
import { useState } from "react"
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Link = {
    _id: string;
    url: string;
    createdAt: string;
    updatedAt: string;
}

export default function AddLink() {
    const [inputValue, setInputvalue] = useState("");
    const [links, setLinks] = useState<Link[]>([]);
    const url = '/api/links';

    const handleAddLink = async () => {
        if (!inputValue.trim()) return;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "url": inputValue }),
            })
            if (!response.ok) {
                throw new Error("Data insertion unsucessful");
            }
            const newLink = await response.json();
            setLinks(prev => [...prev, newLink])
            setInputvalue("");
        } catch (e) {
            console.log(e);
        }
    }

    const fetchLinks = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("some error occured while fetching");
            }
            const result = await response.json();
            setLinks(result);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Link Manager</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Input Section */}
                    <div className="flex gap-2">
                        <Input 
                            value={inputValue} 
                            type="url" 
                            placeholder="Enter URL" 
                            onChange={(e) => setInputvalue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddLink();
                            }} 
                        />
                        <Button type="submit" onClick={handleAddLink}>
                            Add
                        </Button>
                    </div>

                    {/* Links List */}
                    <div className="space-y-2">
                        {links.map((item) => (
                            <div 
                                key={item._id} 
                                className="p-3 border rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline break-all"
                                >
                                    {item.url}
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Fetch Button */}
                    <Button onClick={fetchLinks} variant="outline" className="w-full">
                        Refresh Links
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}