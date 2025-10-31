'use client'
import { useState } from "react"
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"


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
                body: JSON.stringify({ "link": inputValue }),
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
        <div >
            <div className="flex w-full max-w-sm items-center gap-2">
                <Input value={inputValue} type="email" placeholder="Email" onChange={(e) => setInputvalue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddLink();
                    }} />
                <Button type="submit" variant="outline" onClick={handleAddLink}>
                    Add Link
                </Button>
            </div>
            <ul>

                {links.map((item, idx) => (
                    <li key={item._id}>
                        {item.url}
                    </li>
                ))}
            </ul>
            <Button onClick={fetchLinks}>Fetch</Button>
        </div>
    )
}