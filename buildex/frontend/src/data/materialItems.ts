export interface MaterialCategory {
    category: string;
    items: string[];
    icon?: string;
}

export const materialCategories: MaterialCategory[] = [
    {
        category: "Civil / Building Material",
        icon: "🏗",
        items: [
            "Reti (Sand)",
            "Kapchi (Aggregate)",
            "Cement",
            "Bricks",
            "Fly Ash Bricks",
            "AAC Block",
            "Stone",
            "Steel (TMT Bar)",
            "Binding Wire",
            "Shuttering Plywood",
            "Centering Plate",
            "Column Clamp",
            "Concrete Mixer",
            "Water",
            "Chemical (Waterproofing)",
            "POP",
            "Putty",
            "Primer",
            "Paint"
        ]
    },
    {
        category: "Electrical Items",
        icon: "⚡",
        items: [
            "Switch",
            "Socket",
            "Switch Board",
            "MCB",
            "RCCB",
            "Distribution Board",
            "Wire (1.5mm, 2.5mm, 4mm, 6mm)",
            "Flexible Wire",
            "PVC Pipe (Conduit)",
            "Casing Capping",
            "Fan",
            "LED Light",
            "Tube Light",
            "Bulb",
            "Panel Board",
            "Earthing Rod",
            "Earthing Wire",
            "Junction Box",
            "Ceiling Rose",
            "Door Bell",
            "Inverter Wiring",
            "Meter"
        ]
    },
    {
        category: "Plumbing Items",
        icon: "🚰",
        items: [
            "PVC Pipe",
            "CPVC Pipe",
            "UPVC Pipe",
            "Elbow (45°, 90°)",
            "T-Joint",
            "Cross",
            "Valve",
            "Ball Valve",
            "Tap",
            "Angle Valve",
            "Basin Mixer",
            "Shower",
            "Floor Trap",
            "Nahani Trap",
            "Waste Pipe",
            "Water Tank",
            "Tank Connector",
            "Flush Tank",
            "Toilet Seat (WC)",
            "Wash Basin",
            "Sink",
            "Geyser Connection"
        ]
    },
    {
        category: "Tiles / Marble / Flooring",
        icon: "🧱",
        items: [
            "Floor Tiles",
            "Wall Tiles",
            "Bathroom Tiles",
            "Kitchen Tiles",
            "Parking Tiles",
            "Marble",
            "Granite",
            "Kota Stone",
            "Skirting",
            "Tile Adhesive",
            "Tile Spacer",
            "Grout"
        ]
    },
    {
        category: "Carpenter / Wood Work",
        icon: "🪚",
        items: [
            "Plywood",
            "MDF",
            "Laminate",
            "Sunmica",
            "Door",
            "Door Frame",
            "Window",
            "Hinges",
            "Lock",
            "Handle",
            "Screw",
            "Fevicol",
            "Channel",
            "Drawer"
        ]
    },
    {
        category: "Paint & Finishing",
        icon: "🎨",
        items: [
            "Primer",
            "Putty",
            "Distemper",
            "Emulsion Paint",
            "Texture Paint",
            "Enamel Paint",
            "Thinner",
            "Roller"
        ]
    }
];
