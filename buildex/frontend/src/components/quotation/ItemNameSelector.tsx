import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { materialCategories } from '@/data/materialItems';

interface ItemNameSelectorProps {
    value: string;
    category?: string;
    onChange: (value: string) => void;
    className?: string; // Additional classes for trigger
}

export function ItemNameSelector({ value, category, onChange, className }: ItemNameSelectorProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredCategories = category
        ? materialCategories.filter(c => c.category === category)
        : materialCategories;

    const handleSelect = (itemValue: string) => {
        onChange(itemValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal text-left px-0 hover:bg-transparent h-auto min-h-[2rem]",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">{value || "Select item..."}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 opacity-0 group-hover:opacity-50 transition-opacity" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] md:w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search material..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty className="py-2 px-2 text-sm">
                            {search ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                                    onClick={() => handleSelect(search)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Use "{search}"
                                </Button>
                            ) : <span>No items found.</span>}
                        </CommandEmpty>

                        {search && (
                            <CommandGroup heading="Custom">
                                <CommandItem
                                    value={`custom-${search}`}
                                    onSelect={() => handleSelect(search)}
                                    className="cursor-pointer"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Use "{search}"
                                </CommandItem>
                            </CommandGroup>
                        )}


                        {filteredCategories.map((cat) => (
                            <CommandGroup key={cat.category} heading={cat.category}>
                                {cat.items.map((item) => (
                                    <CommandItem
                                        key={item}
                                        value={item}
                                        onSelect={() => handleSelect(item)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === item ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
